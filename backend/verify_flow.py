import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8001"

def test_flow():
    # 1. Generate Topology
    print("1. Requesting Topology Generation...")
    req = urllib.request.Request(
        f"{BASE_URL}/simulate/topology/generate",
        data=json.dumps({"prompt": "star", "params": {}}).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            topology = json.loads(response.read().decode())
    except Exception as e:
        print(f"FAILED to generate: {e}")
        return

    print("   Topology Generated. Nodes:", len(topology["nodes"]))
    
    # Extract IDs
    try:
        nodes = topology["nodes"]
        # Try to find Router -> Server/Host
        src = next((n for n in nodes if "router" in n["type"]), None)
        dst = next((n for n in nodes if "server" in n["type"]), None)
        
        # Fallback for Star/Bus where there might be only switches/hosts
        if not src: src = nodes[0]
        if not dst: dst = nodes[-1]
        
        router_id = src["id"]
        server_id = dst["id"]

        # 1.1 Verify Firewall Exists (Required by User)
        fw = next((n for n in nodes if "firewall" in n["type"]), None)
        if not fw:
            print("CRITICAL FAILURE: H-SAFE Firewall not found in topology!")
            return
        else:
            print(f"   SUCCESS: Found Firewall Node: {fw['name']} ({fw['metadata']['model']})")
        
    except Exception as e:
        print(f"   Could not find required nodes for test: {e}")
        return

    print(f"   Attacker: {router_id}, Target: {server_id}")
    
    # Verify Cisco Models
    print("   Verifying Cisco Models in Metadata:")
    for node in topology["nodes"][:3]:
        model = node["metadata"].get("model", "N/A")
        iface = node["metadata"]["interfaces"][0]["name"]
        print(f"     - {node['name']}: {model} ({iface})")

    # 2. Run Simulation
    print("2. Requesting Topology Simulation...")
    sim_data = {
        "topology": topology,
        "attacker_node": router_id,
        "target_node": server_id,
        "protocol": "TCP",
        "dst_port": 80,
        "packet_count": 1
    }
    
    sim_req = urllib.request.Request(
        f"{BASE_URL}/simulate/topology",
        data=json.dumps(sim_data).encode('utf-8'),
        headers={'Content-Type': 'application/json'} # Fixed header (removed charset)
    )
    
    try:
        with urllib.request.urlopen(sim_req) as response:
            result = json.loads(response.read().decode())
            print("   Simulation Result:", result.get("outcome"))
            if result.get("success"):
                print("SUCCESS: Full flow verified.")
            else:
                print("FAILURE: Simulation returned false success.")
    except Exception as e:
        print(f"FAILED to simulate: {e}")

if __name__ == "__main__":
    test_flow()
