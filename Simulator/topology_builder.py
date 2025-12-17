import json
import uuid
import datetime
from typing import Dict, List, Optional, Any

class TopologyBuilder:
    def __init__(self):
        self.nodes = []
        self.links = []
        self.zones = []

    def _generate_id(self, prefix: str, index: int = None) -> str:
        if index is not None:
            return f"{prefix}_{index:03d}"
        return f"{prefix}_{str(uuid.uuid4())[:8]}"

    def _get_timestamp(self) -> str:
        return datetime.datetime.now(datetime.timezone.utc).isoformat()

    def generate_topology(self, request_type: str, params: Dict = None) -> Dict:
        """
        Main entry point to generate a topology based on request type.
        types: 'simple', 'dmz', 'cloud', 'custom'
        """
        self.nodes = []
        self.links = []
        self.zones = []
        
        request_type = request_type.lower()

        if "simple" in request_type:
            self._create_simple_network()
        elif "dmz" in request_type:
            self._create_dmz_network()
        elif "cloud" in request_type:
            self._create_cloud_network()
        elif "star" in request_type:
            self._create_star_topology()
        elif "bus" in request_type:
            self._create_bus_topology()
        elif "mesh" in request_type:
            self._create_mesh_topology()
        elif "ring" in request_type:
            self._create_ring_topology()
        else:
            # Fallback or custom logic (for now defaulting to simple if unknown)
            self._create_simple_network()

        return self._build_response(f"{request_type}_topology")

    # ... (existing _create_node, _create_link, _create_zone methods) ...

    def _attach_firewall_uplink(self, gateway_id: str, x: int, y: int):
        """
        Helper to attach an H-SAFE Firewall and Internet uplink to a specific gateway node.
        """
        # H-SAFE Firewall
        fw = self._create_node(
            "firewall", 
            "H-SAFE Edge Firewall", 
            "DMZ", 
            "192.168.100.1/24", 
            x, y, 
            "Cisco ASA 5506-X", 
            "GigabitEthernet1/"
        )
        
        # Internet Cloud
        internet = self._create_node(
            "internet", 
            "Internet", 
            "EXTERNAL", 
            "8.8.8.8", 
            x, y - 120, 
            "Cloud-PT", 
            "Coax"
        )
        
        # Links
        # Gateway <-> Firewall
        self._create_link(gateway_id, fw["id"], "UpLink", "G1/1")
        # Firewall <-> Internet
        self._create_link(fw["id"], internet["id"], "G1/2", "Coax7")

        return fw

    def _create_star_topology(self):
        """
        Central Switch with 5 connected Hosts + Firewall Uplink.
        """
        # Central Node
        center = self._create_node("switch", "Central Switch", "LAN", "192.168.1.1/24", 400, 300, "Cisco 2960-24TT", "GigabitEthernet0/")
        
        # Attach Firewall Uplink (North of Center)
        self._attach_firewall_uplink(center["id"], 400, 150)
        
        # Spokes
        import math
        radius = 200
        num_spokes = 5
        
        # Start spokes from bottom to avoid overlapping with firewall
        start_angle = math.pi / 4 
        
        for i in range(num_spokes):
            angle = start_angle + (i * (math.pi / (num_spokes - 1))) # Distribute across bottom half roughly
            x = 400 + int(radius * math.cos(angle))
            y = 300 + int(radius * math.sin(angle))
            
            host = self._create_node(
                "host", 
                f"Host {i+1}", 
                "LAN", 
                f"192.168.1.{100+i}/24", 
                x, y, 
                "PC-PT", 
                "FastEthernet"
            )
            
            self._create_link(center["id"], host["id"], f"F0/{i+1}", "F0")

        self.zones.append({
            "id": self._generate_id("zone", 1),
            "name": "Star LAN",
            "type": "LAN",
            "security_level": 10,
            "nodes": [n["id"] for n in self.nodes]
        })

    def _create_bus_topology(self):
        """
        Backbone of 3 Switches + Firewall Uplink on switch 1.
        """
        x_start = 100
        y_backbone = 300
        spacing = 250

        prev_switch_id = None
        
        for i in range(3):
            x = x_start + (i * spacing)
            
            # Switch on backbone
            sw = self._create_node(
                "switch", 
                f"Bus Switch {i+1}", 
                "LAN", 
                f"192.168.1.{10+i}/24", 
                x, y_backbone, 
                "Cisco 2960-24TT", 
                "G0/"
            )
            
            # Use first switch as Gateway
            if i == 0:
                self._attach_firewall_uplink(sw["id"], x, y_backbone - 150)

            # Link to previous switch
            if prev_switch_id:
                self._create_link(prev_switch_id, sw["id"], f"G0/2", f"G0/1")
            
            prev_switch_id = sw["id"]

            # Attach a host below
            host = self._create_node(
                "host", 
                f"Host {i+1}", 
                "LAN", 
                f"192.168.1.{100+i}/24", 
                x, y_backbone + 150, 
                "PC-PT", 
                "F0"
            )
            self._create_link(sw["id"], host["id"], "F0/1", "F0")

        self.zones.append({
            "id": self._generate_id("zone", 1),
            "name": "Bus LAN",
            "type": "LAN",
            "security_level": 10,
            "nodes": [n["id"] for n in self.nodes]
        })

    def _create_mesh_topology(self):
        """
        4 Routers fully connected + Firewall Uplink on Router 1.
        """
        # 4 corners
        positions = [(200, 200), (600, 200), (200, 500), (600, 500)]
        routers = []
        
        for i, (x, y) in enumerate(positions):
            r = self._create_node(
                "router", 
                f"Mesh Router {i+1}", 
                "WAN", 
                f"10.0.{i+1}.1/24", 
                x, y, 
                "Cisco 2911", 
                "G0/"
            )
            routers.append(r)
            
            # Attach Firewall to first router (top left)
            if i == 0:
                self._attach_firewall_uplink(r["id"], x - 150, y) # To the left
        
        # Fully connect
        for i in range(len(routers)):
            for j in range(i + 1, len(routers)):
                # Link i and j
                r1 = routers[i]
                r2 = routers[j]
                self._create_link(r1["id"], r2["id"], f"G0/{j+1}", f"G0/{i+1}")

        self.zones.append({
            "id": self._generate_id("zone", 1),
            "name": "Mesh WAN",
            "type": "WAN",
            "security_level": 5,
            "nodes": [n["id"] for n in self.nodes]
        })

    def _create_ring_topology(self):
        """
        4 Switches in a closed loop + Firewall Uplink on Switch 1.
        """
        import math
        radius = 200
        center_x, center_y = 400, 350
        num_nodes = 4
        
        switches = []
        
        for i in range(num_nodes):
            angle = (2 * math.pi / num_nodes) * i
            x = center_x + int(radius * math.cos(angle))
            y = center_y + int(radius * math.sin(angle))
            
            sw = self._create_node(
                "switch", 
                f"Ring Switch {i+1}", 
                "LAN", 
                f"192.168.1.{20+i}/24", 
                x, y, 
                "Cisco 2960-24TT", 
                "G0/"
            )
            switches.append(sw)
            
            # Attach Firewall to first switch (Top/Right-ish)
            if i == 0:
                 self._attach_firewall_uplink(sw["id"], x + 150, y)
            
            # Attach a host for utility
            hx = center_x + int((radius + 100) * math.cos(angle))
            hy = center_y + int((radius + 100) * math.sin(angle))
            
            host = self._create_node(
                "host", 
                f"Ring PC {i+1}", 
                "LAN", 
                f"192.168.1.{200+i}/24", 
                hx, hy, 
                "PC-PT", 
                "F0"
            )
            self._create_link(sw["id"], host["id"], "F0/1", "F0")

        # Connect Ring
        for i in range(num_nodes):
            curr = switches[i]
            next_node = switches[(i + 1) % num_nodes]
            self._create_link(curr["id"], next_node["id"], "G0/1", "G0/2")

        self.zones.append({
            "id": self._generate_id("zone", 1),
            "name": "Ring LAN",
            "type": "LAN",
            "security_level": 10,
            "nodes": [n["id"] for n in self.nodes]
        })

    def _create_node(self, type: str, name: str, zone: str, ip: str, x: int, y: int, model: str = None, iface_prefix: str = "eth") -> Dict:
        idx = len(self.nodes) + 1
        node_id = self._generate_id("node", idx)
        
        # Default models if not specified
        if not model:
            if type == "router": model = "Cisco 2911"
            elif type == "switch": model = "Cisco 2960-24TT"
            elif type == "firewall": model = "Cisco ASA 5506-X"
            elif type == "server": model = "Server-PT"
            elif type == "host": model = "PC-PT"
            else: model = "Unknown"

        node = {
            "id": node_id,
            "type": type,
            "name": name,
            "zone": zone,
            "position": {"x": x, "y": y},
            "metadata": {
                "ip": ip,
                "subnet": "255.255.255.0",
                "os": "Cisco IOS" if type in ["router", "switch"] else ("ASA" if type == "firewall" else "Linux"),
                "model": model,
                "rules": [],
                "interfaces": [
                    {"name": f"{iface_prefix}0", "ip": ip, "zone": zone}
                ]
            }
        }
        self.nodes.append(node)
        return node

    def _create_link(self, source_id: str, dest_id: str, src_label: str = "", dst_label: str = ""):
        idx = len(self.links) + 1
        link = {
            "id": self._generate_id("link", idx),
            "source_node_id": source_id,
            "destination_node_id": dest_id,
            "source_label": src_label,
            "destination_label": dst_label,
            "bandwidth": "1Gbps",
            "latency": "5ms",
            "direction": "bidirectional",
            "protocols": ["TCP", "UDP", "ICMP"]
        }
        self.links.append(link)

    def _create_zone(self, name: str, type: str, nodes: List[str], security_level: int):
        idx = len(self.zones) + 1
        zone = {
            "id": self._generate_id("zone", idx),
            "name": name,
            "type": type,
            "security_level": security_level,
            "nodes": nodes
        }
        self.zones.append(zone)

    def _create_simple_network(self):
        """
        1 Router (WAN) -> Cisco 2911
        1 Switch (LAN) -> Cisco 2960
        1 Server (LAN) -> Server
        2 Hosts (LAN) -> PC
        """
        # Nodes
        router = self._create_node("router", "Gateway Router", "WAN", "10.0.0.1/24", 100, 200, "Cisco 2911", "GigabitEthernet0/")
        switch = self._create_node("switch", "Core Switch", "LAN", "192.168.1.1/24", 250, 200, "Cisco 2960-24TT", "GigabitEthernet0/")
        server = self._create_node("server", "File Server", "LAN", "192.168.1.10/24", 400, 100, "Server-PT", "FastEthernet")
        host1 = self._create_node("host", "Workstation 1", "LAN", "192.168.1.101/24", 400, 200, "PC-PT", "FastEthernet")
        host2 = self._create_node("host", "Workstation 2", "LAN", "192.168.1.102/24", 400, 300, "PC-PT", "FastEthernet")

        # Links
        self._create_link(router["id"], switch["id"], "G0/0", "G0/1")
        self._create_link(switch["id"], server["id"], "G0/2", "FE0")
        self._create_link(switch["id"], host1["id"], "G0/3", "FE0")
        self._create_link(switch["id"], host2["id"], "G0/4", "FE0")

        # Zones
        self._create_zone("WAN Zone", "WAN", [router["id"]], 3)
        self._create_zone("LAN Zone", "LAN", [switch["id"], server["id"], host1["id"], host2["id"]], 8)

    def _create_dmz_network(self):
        """
        1 Internet (Cloud)
        1 External FW (ASA 5506-X)
        1 DMZ Switch (2960)
        1 Web Server (Server)
        1 Internal FW (ASA 5506-X)
        1 Internal Switch (2960)
        2 Workstations (PC)
        """
        # Nodes
        internet = self._create_node("internet", "Public Internet", "INTERNET", "8.8.8.8/32", 50, 200, "Cloud-PT", "Coax")
        ext_fw = self._create_node("firewall", "External Firewall", "WAN", "203.0.113.1/24", 200, 200, "ASA 5506-X", "GigabitEthernet1/")
        
        dmz_sw = self._create_node("switch", "DMZ Switch", "DMZ", "172.16.1.1/24", 350, 100, "Cisco 2960-24TT", "GigabitEthernet0/")
        web_srv = self._create_node("server", "Web Server", "DMZ", "172.16.1.10/24", 500, 100, "Server-PT", "FastEthernet")
        
        int_fw = self._create_node("firewall", "Internal Firewall", "LAN", "192.168.1.1/24", 350, 300, "ASA 5506-X", "GigabitEthernet1/")
        lan_sw = self._create_node("switch", "LAN Switch", "LAN", "192.168.1.2/24", 500, 300, "Cisco 2960-24TT", "GigabitEthernet0/")
        
        pc1 = self._create_node("host", "Admin PC", "LAN", "192.168.1.100/24", 650, 250, "PC-PT", "FastEthernet")
        pc2 = self._create_node("host", "User PC", "LAN", "192.168.1.101/24", 650, 350, "PC-PT", "FastEthernet")

        # Links
        self._create_link(internet["id"], ext_fw["id"], "Coax7", "G1/1")
        
        # Ext FW(G1/2) -> DMZ SW(G0/1)
        self._create_link(ext_fw["id"], dmz_sw["id"], "G1/2", "G0/1")
        # Ext FW(G1/3) -> Int FW(G1/1)
        self._create_link(ext_fw["id"], int_fw["id"], "G1/3", "G1/1")
        
        self._create_link(dmz_sw["id"], web_srv["id"], "G0/2", "FE0")
        
        # Int FW(G1/2) -> LAN SW(G0/1)
        self._create_link(int_fw["id"], lan_sw["id"], "G1/2", "G0/1")
        
        self._create_link(lan_sw["id"], pc1["id"], "G0/2", "FE0")
        self._create_link(lan_sw["id"], pc2["id"], "G0/3", "FE0")

        # Zones
        self._create_zone("Internet", "INTERNET", [internet["id"]], 1)
        self._create_zone("WAN DMZ Edge", "WAN", [ext_fw["id"]], 4)
        self._create_zone("DMZ", "DMZ", [dmz_sw["id"], web_srv["id"]], 6)
        self._create_zone("Corporate LAN", "LAN", [int_fw["id"], lan_sw["id"], pc1["id"], pc2["id"]], 9)

    def _create_cloud_network(self):
        """
        Abstracted Cloud View
        """
        # Nodes
        gw = self._create_node("router", "Cloud Gateway", "WAN", "1.2.3.4/24", 100, 200, "Cisco 2911", "GigabitEthernet0/")
        lb = self._create_node("switch", "Load Balancer", "DMZ", "10.0.1.1/24", 250, 200, "Cisco 2960-24TT", "GigabitEthernet0/")
        
        app1 = self._create_node("server", "App Instance 1", "LAN", "10.0.2.10/24", 400, 150, "Server-PT", "FastEthernet")
        app2 = self._create_node("server", "App Instance 2", "LAN", "10.0.2.11/24", 400, 250, "Server-PT", "FastEthernet")
        
        db = self._create_node("server", "Database", "LAN", "10.0.3.5/24", 550, 200, "Server-PT", "FastEthernet")

        # Links
        self._create_link(gw["id"], lb["id"], "G0/0", "G0/1")
        self._create_link(lb["id"], app1["id"], "G0/2", "FE0")
        self._create_link(lb["id"], app2["id"], "G0/3", "FE0")
        self._create_link(app1["id"], db["id"], "FE1", "FE0") # Servers direct connect? Or via another sw. Simplified here.
        self._create_link(app2["id"], db["id"], "FE1", "FE1")

        # Zones
        self._create_zone("Cloud Edge", "WAN", [gw["id"]], 3)
        self._create_zone("Public Subnet", "DMZ", [lb["id"]], 5)
        self._create_zone("Private Subnet", "LAN", [app1["id"], app2["id"], db["id"]], 8)

    def _build_response(self, name: str) -> Dict:
        return {
            "metadata": {
                "name": name,
                "description": f"Generated {name}",
                "created_at": self._get_timestamp(),
                "version": "1.0",
                "simulator": "H-SAFE"
            },
            "nodes": self.nodes,
            "links": self.links,
            "zones": self.zones
        }

def generate_topology_data(prompt: str) -> Dict:
    builder = TopologyBuilder()
    return builder.generate_topology(prompt)
