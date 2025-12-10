from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scapy.all import rdpcap, IP, TCP, UDP
import shutil
import os
import tempfile
from datetime import datetime

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import StreamingResponse
import json
import asyncio

@app.post("/analyze-pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    if not file.filename.endswith(('.pcap', '.pcapng')):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .pcap or .pcapng file.")

    # Save uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    async def packet_generator():
        try:
            # Read PCAP file using Scapy
            packets = rdpcap(tmp_path)
            
            # Analyze first 50 packets
            for i, pkt in enumerate(packets[:50]):
                await asyncio.sleep(0.1) # Simulate real-time processing delay
                
                if IP in pkt:
                    src_ip = pkt[IP].src
                    dst_ip = pkt[IP].dst
                    proto_num = pkt[IP].proto
                    
                    # Determine protocol name
                    protocol = "Other"
                    if TCP in pkt:
                        protocol = "TCP"
                        sport = pkt[TCP].sport
                        dport = pkt[TCP].dport
                    elif UDP in pkt:
                        protocol = "UDP"
                        sport = pkt[UDP].sport
                        dport = pkt[UDP].dport
                    else:
                        sport = "-"
                        dport = "-"
                        if proto_num == 1: protocol = "ICMP"

                    # Basic Threat Detection Logic (Simulation)
                    status = "Normal"
                    reason = "-"
                    payload_snippet = str(bytes(pkt[IP].payload))[:20] + "..."

                    # Simulated malicious patterns
                    if dport == 80 and "UNION SELECT" in str(pkt[IP].payload):
                        status = "Malicious"
                        reason = "SQL Injection Attempt"
                    elif dport == 445: # SMB
                        status = "Malicious"
                        reason = "Suspicious SMB Activity"
                    elif src_ip.startswith("192.168.1.100"): # Mock blacklisted IP
                        status = "Malicious"
                        reason = "Known Malicious Source"

                    packet_data = {
                        "id": i,
                        "timestamp": datetime.fromtimestamp(float(pkt.time)).strftime('%Y-%m-%d %H:%M:%S'),
                        "source": src_ip,
                        "destination": dst_ip,
                        "protocol": protocol,
                        "port": dport,
                        "payload": payload_snippet,
                        "status": status,
                        "reason": reason
                    }
                    
                    # Yield JSON string + newline (NDJSON format)
                    json_data = json.dumps(packet_data) + "\n"
                    print(f"Yielding packet: {packet_data['id']}") # Debug log
                    yield json_data

        except Exception as e:
            yield json.dumps({"error": str(e)}) + "\n"
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    return StreamingResponse(packet_generator(), media_type="application/x-ndjson")

@app.get("/")
def read_root():
    return {"message": "H-Safe PCAP Analysis API is running"}
