import time
import os
import sys
import shutil
import json
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import FileResponse

# Add Simulator directory to sys.path
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
root_path = "/api" if os.environ.get("VERCEL") else ""

app = FastAPI(root_path=root_path)

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "https://hsafe.in", "https://h-safe.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# MODELS
# =========================

class RuleCreate(BaseModel):
    name: str
    description: str
    severity: str
    action: str
    protocol: Optional[str] = None
    conditions: dict
    enabled: bool = True

class TopologySimRequest(BaseModel):
    topology: dict
    attacker_node: str
    target_node: str
    protocol: str = "TCP"
    dst_port: int = 80
    packet_count: int = 5

class ExportRequest(BaseModel):
    report: dict
    format: str

# =========================
# ENDPOINTS
# =========================

@app.get("/")
def read_root():
    return {"message": "H-Safe Simulator API is running"}

# --- RULES MANAGEMENT (Legacy/Optional - now Client Side usually) ---

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
            position=None
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
        updates = rule.dict()
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
UPLOAD_DIR = "/tmp/uploads" 
os.makedirs(UPLOAD_DIR, exist_ok=True)
PERSISTENT_PCAP_PATH = os.path.join(UPLOAD_DIR, "current.pcap")

@app.get("/pcap/status")
def get_pcap_status():
    """Check if a persistent PCAP file exists."""
    return {"exists": os.path.exists(PERSISTENT_PCAP_PATH)}

@app.delete("/pcap")
def delete_pcap():
    """Remove stored PCAP file."""
    if os.path.exists(PERSISTENT_PCAP_PATH):
        os.remove(PERSISTENT_PCAP_PATH)
    return {"ok": True}

# --- SIMULATION ---

@app.post("/analyze/pcap")
async def analyze_pcap_endpoint(
    file: Optional[UploadFile] = File(None),
    rules_json: Optional[str] = Form(None)
):
    """
    1. Receive PCAP file (optional, otherwise use persistent).
    2. Receive Rules (optional JSON string).
    3. Run Simulation.
    4. Return analysis.
    """
    try:
        if file:
            with open(PERSISTENT_PCAP_PATH, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            target_path = PERSISTENT_PCAP_PATH
        elif os.path.exists(PERSISTENT_PCAP_PATH):
            target_path = PERSISTENT_PCAP_PATH
        else:
            raise HTTPException(status_code=400, detail="No PCAP file provided or found on server.")

        # 1. Load Rules (Prefer client-provided, fallback to empty)
        if rules_json:
            try:
                raw_rules = json.loads(rules_json)
                rules = [r for r in raw_rules if r.get("enabled") is not False]
            except json.JSONDecodeError:
                rules = []
        else:
            rules = [] # Default to empty if no client rules provided

        # 2. Run Simulation on the persistent file
        simulation_result = pcap_analysis.simulate_pcap_flow(target_path, rules)

        # 3. Analyze Results
        final_report = post_attack_analysis.analyze_firewall_run(simulation_result)

        response = {
            "report": final_report,
            "simulation": simulation_result 
        }
        return response

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate/topology")
def run_topology_simulation(req: TopologySimRequest):
    """
    Run simulation based on visual topology.
    """
    try:
        topology_data = req.topology.copy()
        if "paths" in topology_data:
             topology_data["paths"] = [tuple(p) for p in topology_data["paths"]]

        import topology_simulation

        # Get rules (either from storage or potentially passed in request in future)
        # For now, fetching global rules as before
        rules = rule_addition.get_all_rules(include_disabled=False)

        result = topology_simulation.simulate_attack(
            topology=topology_data,
            attacker_node=req.attacker_node,
            target_node=req.target_node,
            protocol=req.protocol,
            dst_port=req.dst_port,
            packet_count=req.packet_count,
            rules=rules  # Pass rules to engine
        )
        
        return result

        # For Topology, we might also want to accept rules in the request body later.
        # For now, we fall back to get_all_rules (which might be empty on Vercel)
        # TODO: Accept rules in TopologySimRequest
        # Result is now a detailed dictionary, return it directly
        return result

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# --- REPORTING ---

@app.post("/report/export")
def export_report_endpoint(req: ExportRequest):
    """
    Export simulation report to specified format.
    """
    try:
        import report_generator
        
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
