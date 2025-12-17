# topology_simulation.py
# Network topology and traffic simulation for H-SAFE Firewall Simulator

import time
import collections
from typing import Dict, List, Tuple, Any

# Reuse existing schema components
from schema import Packet, new_packet, Detection
# Import the rule engine
import rule_implementation


# =========================
# GRAPH & TRAVERSAL LOGIC
# =========================

class TopologyGraph:
    def __init__(self, nodes: Dict, edges: List[Any], edge_format: str = "tuple"):
        """
        nodes: Dict of node_id -> node_data
        edges: List of connections
        edge_format: 'tuple' (legacy list of tuples) or 'link_obj' (new schema list of dicts)
        """
        self.nodes = nodes
        self.adj = collections.defaultdict(list)
        
        if edge_format == "tuple":
            for u, v in edges:
                self.adj[u].append(v)
                self.adj[v].append(u)
        elif edge_format == "link_obj":
            for link in edges:
                u = link.get("source_node_id")
                v = link.get("destination_node_id")
                if u and v:
                    self.adj[u].append(v)
                    self.adj[v].append(u)

    def bfs_shortest_path(self, start_node: str, end_node: str) -> List[str]:
        """
        Find shortest path (hop-count) between two nodes.
        Returns list of node IDs: [start, ..., end]
        """
        if start_node not in self.nodes or end_node not in self.nodes:
            return []
            
        queue = collections.deque([[start_node]])
        visited = {start_node}
        
        while queue:
            path = queue.popleft()
            node = path[-1]
            
            if node == end_node:
                return path
                
            for neighbor in self.adj[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    new_path = list(path)
                    new_path.append(neighbor)
                    queue.append(new_path)
                    
        return []

def _get_node_scan_result(node_id: str, node_data: Dict, packet: Packet, firewall_rules: List) -> Dict:
    """
    Simulate processing a packet at a single node.
    Returns decision dict: { "action": "FORWARD" | "DROP" | "ALERT", "meta": ... }
    """
    node_type = node_data.get("type", "unknown")
    
    # 1. FIREWALL LOGIC
    if node_type == "firewall":
        # Apply H-SAFE Rule Engine
        detections = rule_implementation.apply_rules([packet], firewall_rules)
        
        # Analyze detections
        denies = [d for d in detections if d["action"] == "DENY"]
        alerts = [d for d in detections if d["action"] == "ALERT"]
        
        if denies:
            return {
                "action": "DROP", 
                "reason": f"Firewall Rule #{denies[0]['rule_id']} ({denies[0]['rule_name']})", 
                "detections": detections
            }
        elif alerts:
            return {
                "action": "FORWARD", # Alerts don't stop traffic
                "reason": "Allowed with Alerts",
                "detections": detections
            }
        else:
             return {
                "action": "FORWARD",
                "reason": "Allowed (Default)",
                "detections": []
            }
            
    # 2. ROUTER/SWITCH/HOST LOGIC (Simple Forwarding)
    return {"action": "FORWARD", "reason": "Forwarded", "detections": []}


# =========================
# PUBLIC API
# =========================

def simulate_attack(
    topology: Dict,
    attacker_node: str,
    target_node: str,
    protocol: str = "TCP",
    dst_port: int = 80,
    packet_count: int = 1, # Usually 1 for path analysis, but can be more
    rules: List = None
) -> Dict:
    """
    Simulate Logical Packet flow through the topology.
    Returns detailed trace of the packet's journey.
    """
    if rules is None:
        rules = []

    # Handle Schema differences (Legacy vs New Builder)
    nodes_raw = topology.get("nodes", {})
    
    # 1. Normalize Nodes to Dict if it's a list (New Schema)
    if isinstance(nodes_raw, list):
        nodes_data = {n["id"]: n for n in nodes_raw}
    else:
        nodes_data = nodes_raw
        
    # 2. Identify Edge Format
    if "links" in topology:
        edges_data = topology["links"]
        edge_fmt = "link_obj"
    elif "paths" in topology:
        edges_data = topology["paths"]
        edge_fmt = "tuple"
    else:
        edges_data = []
        edge_fmt = "tuple"
    
    # Build Graph
    graph = TopologyGraph(nodes_data, edges_data, edge_format=edge_fmt)
    
    # 1. Routing (Find Path)
    path_nodes = graph.bfs_shortest_path(attacker_node, target_node)
    
    if not path_nodes:
        return {
            "success": False,
            "message": "No functional path found between selected nodes.",
            "path": [],
            "trace": []
        }

    # 2. Packet Creation
    # 2. Packet Creation
    src_node = nodes_data.get(attacker_node, {})
    src_ip = src_node.get("metadata", {}).get("ip") or src_node.get("ip", "0.0.0.0")
    
    dst_node = nodes_data.get(target_node, {})
    dst_ip = dst_node.get("metadata", {}).get("ip") or dst_node.get("ip", "0.0.0.0")
    
    print(f"[DEBUG-SIM] Creating Packet: {src_ip} -> {dst_ip} (Node: {attacker_node} -> {target_node})")
    
    packet = new_packet(
        src_ip=src_ip,
        dst_ip=dst_ip,
        protocol=protocol,
        src_port=12345,
        dst_port=dst_port,
        payload_size=64
    )

    # 3. Traversal Simulation (Hop-by-Hop)
    trace_log = []
    final_outcome = "ARRIVED"
    
    for hop_idx, node_id in enumerate(path_nodes):
        node_meta = nodes_data.get(node_id, {})
        
        # Simulate processing at this node
        result = _get_node_scan_result(node_id, node_meta, packet, rules)
        
        step_info = {
            "hop": hop_idx + 1,
            "node_id": node_id,
            "node_type": node_meta.get("type"),
            "node_label": node_meta.get("label", node_id), # Assuming label might vary
            "action": result["action"],
            "details": result["reason"],
            "detections": result.get("detections", [])
        }
        trace_log.append(step_info)
        
        if result["action"] == "DROP":
            final_outcome = "BLOCKED"
            break
            
    # 4. Construct Response
    return {
        "success": True,
        "outcome": final_outcome,
        "packet": packet,
        "path": path_nodes,  # Expected path
        "trace": trace_log,   # Actual traversed path with logs
        "summary": {
            "total_packets": packet_count,
            "traversed_hops": len(trace_log),
            "final_status": final_outcome
        },
        # Compatibility with legacy frontend which expects 'detections' list
        "detections": [d for step in trace_log for d in step.get("detections", [])] 
    }
