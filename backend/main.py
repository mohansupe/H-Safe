import time
import os
import sys
import shutil
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Body, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
# Add Simulator directory to sys.path
# Assuming structure:
# /root
#   /backend/main.py
#   /Simulator/
current_dir = os.path.dirname(os.path.abspath(__file__))
simulator_path = os.path.join(current_dir, '..', 'Simulator')
sys.path.append(simulator_path)

# Import Simulator Modules
import rule_addition
import rule_implementation
import pcap_analysis
import report_generator
import schema
import post_attack_analysis

# Determine root_path based on environment
# Vercel passes the full path /api/... so we need to tell FastAPI that /api is the root
root_path = "/api" if os.environ.get("VERCEL") else ""

app = FastAPI(root_path=root_path)

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# MODELS
# =========================

from pydantic import BaseModel

class RuleCreate(BaseModel):
    name: str
    description: str
    severity: str
    action: str
    protocol: Optional[str] = None
    conditions: dict
    enabled: bool = True

# =========================
# ENDPOINTS
# =========================

@app.get("/")
def read_root():
    return {"message": "H-Safe Simulator API is running"}

# --- RULES MANAGEMENT ---

@app.get("/rules")
def get_rules():
    """List all firewall rules."""
    try:
        rules = rule_addition.get_all_rules(include_disabled=True)
        return rules
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rules")
def create_rule(rule: RuleCreate):
    """Create a new firewall rule."""
    try:
        new_rule = rule_addition.add_rule(
            name=rule.name,
            description=rule.description,
            severity=rule.severity,
            action=rule.action,
            protocol=rule.protocol,
            conditions=rule.conditions,
            enabled=rule.enabled,
            position=None # Frontend doesn't send this often on create, usually default append
        )
        return new_rule
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rules/{rule_id}/move")
def move_rule_endpoint(rule_id: str, new_position: int = Body(..., embed=True)):
    """Move a rule to a new position."""
    try:
        success = rule_addition.move_rule(rule_id, new_position)
        
        if not success:
            raise HTTPException(status_code=404, detail="Rule not found")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.delete("/rules/{rule_id}")
def delete_rule(rule_id: str):
    """Delete a firewall rule."""
    try:
        success = rule_addition.delete_rule(rule_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Rule not found")
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/rules/{rule_id}")
def update_rule_endpoint(rule_id: str, rule: RuleCreate):
    """Update an existing firewall rule."""
    try:
        # Convert Pydantic model to dict
        updates = rule.dict()
        
        # Call update logic
        updated = rule_addition.update_rule(rule_id, updates)
        
        if not updated:
            raise HTTPException(status_code=404, detail="Rule not found")
            
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/rules/{rule_id}/status")
def toggle_rule_status(rule_id: str, enabled: bool = Body(..., embed=True)):
    """Enable or disable a rule."""
    try:
        updated = rule_addition.toggle_rule(rule_id, enabled)
        
        if not updated:
            raise HTTPException(status_code=404, detail="Rule not found")
            
        return updated
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- PCAP MANAGEMENT ---

# Use /tmp/uploads for Vercel compatibility
UPLOAD_DIR = "/tmp/uploads" # os.path.join(simulator_path, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
PERSISTENT_PCAP_PATH = os.path.join(UPLOAD_DIR, "current.pcap")

@app.get("/pcap/status")
def get_pcap_status():
    """Check if a persistent PCAP file exists."""
    exists = os.path.exists(PERSISTENT_PCAP_PATH)
    if exists:
        return {
            "exists": True,
            "filename": "current.pcap", # Metadata could be stored in a sidecar json if needed
            "size": os.path.getsize(PERSISTENT_PCAP_PATH)
        }
    return {"exists": False}

@app.delete("/pcap")
def delete_pcap():
    """Delete the persistent PCAP file."""
    if os.path.exists(PERSISTENT_PCAP_PATH):
        os.remove(PERSISTENT_PCAP_PATH)
    return {"ok": True}

# --- SIMULATION ---

@app.post("/simulate")
async def run_simulation(file: Optional[UploadFile] = File(None)):
    """
    Run full simulation:
    1. If file provided: Save it as persistent 'current.pcap' and run.
    2. If no file: Check for 'current.pcap' and run.
    """
    target_path = PERSISTENT_PCAP_PATH

    # If file uploaded, overwrite persistent file
    if file:
        if not file.filename.endswith(('.pcap', '.pcapng', '.cap')):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .pcap file.")
        
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # Verify file exists (either just uploaded or previous persistent)
    if not os.path.exists(target_path):
        raise HTTPException(status_code=400, detail="No PCAP file provided or found on server.")

    try:
        # 1. Load active rules
        rules = rule_addition.get_all_rules(include_disabled=False)
        
        # 2. Run Simulation on the persistent file
        simulation_result = pcap_analysis.simulate_pcap_flow(target_path, rules)
        
        # 3. Analyze Results
        final_report = post_attack_analysis.analyze_firewall_run(simulation_result)
        
        # Merge raw simulation data if needed by frontend
        response = {
            "report": final_report,
            "simulation": simulation_result 
        }
        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- TOPOLOGY SIMULATION ---

class TopologySimRequest(BaseModel):
    topology: dict  # Expected: { "nodes": { "id": {"ip": "..."} }, "paths": [ ["src", "dst"] ] }
    attacker_node: str
    target_node: str
    protocol: str = "TCP"
    dst_port: int = 80
    packet_count: int = 5

@app.post("/simulate/topology")
def run_topology_simulation(req: TopologySimRequest):
    """
    Run simulation based on visual topology:
    1. Generate traffic from Attacker -> Target (via Firewall if in path).
    2. Apply active rules.
    3. Return analysis.
    """
    try:
        # 1. Generate Packets
        # Ensure paths are tuples for the internal logic if strictly required, 
        # but the module uses (src, dst) in paths check. JSON arrays come as lists.
        # topology_simulation._path_exists uses `(src, dst) in paths`. 
        # [ "a", "b" ] in [ ("a", "b") ] is False. [ "a", "b" ] in [ ["a", "b"] ] is True.
        # Let's standardize on tuples for safety if the module expects tuples.
        # Checking topology_simulation.py again... 
        # default implementation: return (src, dst) in paths.
        # We will convert paths to tuples just in case.
        topology_data = req.topology.copy()
        if "paths" in topology_data:
             topology_data["paths"] = [tuple(p) for p in topology_data["paths"]]

        # Also need to import topology_simulation if not imported
        # It was imported as 'topology_simulation' or we need to add it to imports
        # Check imports at top... imports were wrapped in try/except. 
        # Assuming `import topology_simulation` works if it exists in Simulator dir.
        # But wait, lines 24-30 imported specific modules. topology_simulation wasn't one of them.
        # I need to add the import.
        import topology_simulation

        packets = topology_simulation.simulate_attack(
            topology=topology_data,
            attacker_node=req.attacker_node,
            target_node=req.target_node,
            protocol=req.protocol,
            dst_port=req.dst_port,
            packet_count=req.packet_count
        )

        # 2. Get Rules
        # For topology simulation, we usually want *all* enabled rules, 
        # OR specifically rules attached to the firewall node in the path.
        # For this phase 1, we will apply ALL enabled global rules.
        # Future improvement: filter rules if multiple firewalls exist.
        rules = rule_addition.get_all_rules(include_disabled=False)

        # 3. Apply Rules
        detections = rule_implementation.apply_rules(packets, rules)

        # 4. Analyze
        # We need a custom analysis or reuse post_attack_analysis
        # post_attack_analysis.analyze_firewall_run expects a SimulationResult (dict with matched/dropped etc)
        # or we can construct one.
        # Let's see pcap_analysis.simulate_pcap_flow return type.
        # It returns { "total_packets":..., "detections":..., "final_disposition": ... }
        
        # We can construct a similar result object manually
        # Detections have an 'action'.
        
        allowed_count = 0
        dropped_count = 0
        alert_count = 0 
        
        # This simple logic mimics what pcap_analysis does
        for p in packets:
            # Check if packet triggered a DENY
            # The apply_rules function returns ALL detections. 
            # If a packet triggered a DENY, it stops there.
            # We need to map packet -> outcome.
            
            # Actually, apply_rules returns a list of Detection objects.
            # It doesn't tell us about ALLOWED packets explicitly unless we trace it.
            # But the requirement is likely just to show what happened.
            pass

        # Use post_attack_analysis if possible, but it might be tied to PCAP structure.
        # Let's just return the raw packets and detections for the frontend to visualize for now.
        # That's simpler and more flexible for the UI.
        
        response = {
            "packets": packets,
            "detections": detections,
            "summary": {
                "total_packets": len(packets),
                "total_detections": len(detections)
            }
        }

        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- REPORTING ---

from fastapi.responses import FileResponse

class ExportRequest(BaseModel):
    report: dict
    format: str # pdf, csv, json

@app.post("/report/export")
def export_report_endpoint(req: ExportRequest):
    """
    Export simulation report to specified format.
    """
    try:
        import report_generator
        
        # Create a temp file path
        # We'll use the uploads dir or a temp dir
        filename = f"report_{int(time.time())}.{req.format}"
        output_path = os.path.join(UPLOAD_DIR, filename)
        
        if req.format.lower() == "pdf":
            report_generator.export_pdf(req.report, output_path)
            media_type = "application/pdf"
        elif req.format.lower() == "csv":
            report_generator.export_csv(req.report, output_path)
            media_type = "text/csv"
        elif req.format.lower() == "json":
            report_generator.export_json(req.report, output_path)
            media_type = "application/json"
        else:
            raise HTTPException(status_code=400, detail="Unsupported format. Use pdf, csv, or json.")
            
        
        if not os.path.exists(output_path):
             raise HTTPException(status_code=500, detail="Failed to generate report file.")

        return FileResponse(
            path=output_path, 
            filename=filename, 
            media_type=media_type
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
