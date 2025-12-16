# topology_simulation.py
# Network topology and traffic simulation for H-SAFE Firewall Simulator

import time
import collections
from typing import Dict, List, Tuple

# Reuse existing schema components
from schema import Packet, new_packet, Detection
# Import the rule engine
import rule_implementation


# =========================
# GRAPH & TRAVERSAL LOGIC
# =========================

class TopologyGraph:
    def __init__(self, nodes: Dict, edges: List[Tuple[str, str]]):
        self.nodes = nodes
        self.adj = collections.defaultdict(list)
        for u, v in edges:
            self.adj[u].append(v)
            self.adj[v].append(u) # Undirected for simple link simulation

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
                "reason": f"Firewall Rule #{denies[0]['rule']['id']}", 
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

    nodes_data = topology.get("nodes", {})
    paths_data = topology.get("paths", [])
    
    # Build Graph
    graph = TopologyGraph(nodes_data, paths_data)
    
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
    src_ip = nodes_data.get(attacker_node, {}).get("ip", "0.0.0.0")
    dst_ip = nodes_data.get(target_node, {}).get("ip", "0.0.0.0")
    
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
