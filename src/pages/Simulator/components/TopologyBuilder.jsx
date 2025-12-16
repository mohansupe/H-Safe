import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    Handle,
    Position,
    Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    Monitor,
    Server,
    Router,
    ShieldCheck,
    Cloud,
    Database,
    Smartphone,
    Wifi,
    Trash2
} from 'lucide-react';

const initialNodes = [
    {
        id: '1',
        type: 'host',
        data: { label: 'Admin PC' },
        position: { x: 250, y: 5 },
    },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

// --- Custom Nodes ---

const NodeWrapper = ({ children, label, icon: Icon, color }) => (
    <div className={`px-4 py-2 shadow-lg rounded-md bg-slate-900 border-2 ${color} min-w-[150px]`}>
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-500" />
        <div className="flex items-center">
            <div className={`rounded-full p-2 ${color.replace('border-', 'bg-')}/20 mr-3`}>
                <Icon className={`w-6 h-6 ${color.replace('border-', 'text-')}`} />
            </div>
            <div>
                <div className="text-xs text-slate-400 font-bold uppercase">{label}</div>
            </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-500" />
    </div>
);

const HostNode = ({ data }) => (
    <NodeWrapper label={data.label} icon={Monitor} color="border-blue-500" />
);

const ServerNode = ({ data }) => (
    <NodeWrapper label={data.label} icon={Server} color="border-indigo-500" />
);

const RouterNode = ({ data }) => (
    <NodeWrapper label={data.label} icon={Router} color="border-orange-500" />
);

const FirewallNode = ({ data }) => (
    <NodeWrapper label={data.label} icon={ShieldCheck} color="border-red-500" />
);

const CloudNode = ({ data }) => (
    <NodeWrapper label={data.label} icon={Cloud} color="border-cyan-500" />
);

const SwitchNode = ({ data }) => (
    <div className="px-4 py-2 shadow-lg rounded-md bg-slate-900 border-2 border-green-500 min-w-[150px]">
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-500" />
        <div className="flex items-center justify-center">
            <div className="text-green-500 font-mono font-bold text-lg">[SWITCH]</div>
        </div>
        <div className="text-center text-xs text-slate-400 mt-1">{data.label}</div>
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-500" />
    </div>
);


const nodeTypes = {
    host: HostNode,
    server: ServerNode,
    router: RouterNode,
    firewall: FirewallNode,
    cloud: CloudNode,
    switch: SwitchNode
};

// --- Sidebar Component ---

const Sidebar = () => {
    const onDragStart = (event, nodeType, label) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow-label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const DraggableItem = ({ type, label, icon: Icon, color }) => (
        <div
            className={`flex items-center p-3 mb-2 rounded cursor-grab bg-slate-800 border border-slate-700 hover:border-slate-500 transition-colors`}
            onDragStart={(event) => onDragStart(event, type, label)}
            draggable
        >
            <Icon className={`w-5 h-5 mr-3 ${color}`} />
            <span className="text-slate-300 text-sm font-bold">{label}</span>
        </div>
    );

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-700 p-4 h-full flex flex-col">
            <h3 className="text-white font-bold mb-4 text-lg">Toolkit</h3>
            <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2 mt-4 ml-1">End Devices</div>
                <DraggableItem type="host" label="PC / Laptop" icon={Monitor} color="text-blue-500" />
                <DraggableItem type="server" label="Server" icon={Server} color="text-indigo-500" />

                <div className="text-xs font-bold text-slate-500 uppercase mb-2 mt-4 ml-1">Network</div>
                <DraggableItem type="switch" label="Switch" icon={Database} color="text-green-500" />
                <DraggableItem type="router" label="Router" icon={Router} color="text-orange-500" />

                <div className="text-xs font-bold text-slate-500 uppercase mb-2 mt-4 ml-1">Security</div>
                <DraggableItem type="firewall" label="H-Safe" icon={ShieldCheck} color="text-red-500" />

                <div className="text-xs font-bold text-slate-500 uppercase mb-2 mt-4 ml-1">External</div>
                <DraggableItem type="cloud" label="Internet" icon={Cloud} color="text-cyan-500" />
            </div>

            <div className="mt-auto p-4 bg-slate-800/50 rounded text-xs text-slate-500">
                Drag items to the canvas to build your topology.
            </div>
        </aside>
    );
};

const API_URL = 'http://localhost:8000';

// --- Properties Panel ---

const PropertiesPanel = ({ selectedNode, updateNodeData, existingRules }) => {
    if (!selectedNode) {
        return (
            <aside className="w-72 bg-slate-900 border-l border-slate-700 p-6 h-full flex flex-col justify-center items-center text-center">
                <div className="p-4 bg-slate-800 rounded-full mb-4">
                    <Monitor className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-slate-400 font-bold text-lg mb-2">No Selection</h3>
                <p className="text-slate-500 text-sm">Select a node to configure its properties.</p>
            </aside>
        );
    }

    const handleChange = (field, value) => {
        updateNodeData(selectedNode.id, { [field]: value });
    };

    const handleRuleToggle = (ruleId) => {
        const currentRules = selectedNode.data.activeRules || [];
        const newRules = currentRules.includes(ruleId)
            ? currentRules.filter(id => id !== ruleId)
            : [...currentRules, ruleId];
        handleChange('activeRules', newRules);
    };

    return (
        <aside className="w-72 bg-slate-900 border-l border-slate-700 p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <div className={`p-2 rounded bg-slate-800 border border-slate-700`}>
                    {/* Icon placeholder could be dynamic based on type */}
                    <div className="font-bold text-xs uppercase text-slate-500">{selectedNode.type}</div>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg truncate w-40">{selectedNode.data.label}</h3>
                    <div className="text-xs text-blue-400">ID: {selectedNode.id}</div>
                </div>
            </div>

            <div className="space-y-6">
                {/* Common Properties */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">General</label>

                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Device Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            value={selectedNode.data.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                        />
                    </div>
                </div>

                {/* Network Properties */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Network Configuration</label>

                    <div>
                        <label className="block text-slate-400 text-xs mb-1">IP Address</label>
                        <input
                            type="text"
                            placeholder="192.168.1.10"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                            value={selectedNode.data.ip || ''}
                            onChange={(e) => handleChange('ip', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Subnet Mask</label>
                        <input
                            type="text"
                            placeholder="255.255.255.0"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                            value={selectedNode.data.subnet || ''}
                            onChange={(e) => handleChange('subnet', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Default Gateway</label>
                        <input
                            type="text"
                            placeholder="192.168.1.1"
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
                            value={selectedNode.data.gateway || ''}
                            onChange={(e) => handleChange('gateway', e.target.value)}
                        />
                    </div>
                </div>

                {/* Role Specific */}
                {selectedNode.type === 'firewall' && (
                    <div className="space-y-3 pt-4 border-t border-slate-800">
                        <label className="text-xs font-bold text-red-500 uppercase">H-Safe Policy Import</label>
                        <div className="bg-slate-950 border border-slate-800 rounded p-2 max-h-40 overflow-y-auto">
                            {existingRules.length === 0 ? (
                                <div className="text-xs text-slate-500 text-center py-2">No rules found. Add them in Rule Management.</div>
                            ) : (
                                existingRules.map(rule => (
                                    <div key={rule.id} className="flex items-center mb-2 last:mb-0">
                                        <input
                                            type="checkbox"
                                            id={`rule-${rule.id}`}
                                            className="mr-2"
                                            checked={(selectedNode.data.activeRules || []).includes(rule.id)}
                                            onChange={() => handleRuleToggle(rule.id)}
                                        />
                                        <label htmlFor={`rule-${rule.id}`} className="text-xs text-slate-300 cursor-pointer truncate">
                                            <span className={`font-bold ${rule.action === 'Allow' ? 'text-green-500' : 'text-red-500'}`}>[{rule.action}]</span> {rule.source_ip} &rarr; {rule.destination_ip}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                            Select rules to apply to this H-Safe instance.
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
};

// --- Simulation Panel ---

const SimulationPanel = ({ nodes, onRunSimulation, simulationResult, isSimulating }) => {
    const [config, setConfig] = useState({
        attackerId: '',
        targetId: '',
        protocol: 'TCP',
        port: 80
    });

    const devices = nodes.filter(n => ['host', 'server', 'cloud'].includes(n.type));

    const handleSubmit = () => {
        if (!config.attackerId || !config.targetId) return;
        onRunSimulation(config);
    };

    return (
        <div className="absolute bottom-6 left-6 z-10 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl w-80">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Traffic Generator
            </h3>

            <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Source</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded text-xs text-white p-2"
                            value={config.attackerId}
                            onChange={e => setConfig({ ...config, attackerId: e.target.value })}
                        >
                            <option value="">Select...</option>
                            {devices.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Destination</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded text-xs text-white p-2"
                            value={config.targetId}
                            onChange={e => setConfig({ ...config, targetId: e.target.value })}
                        >
                            <option value="">Select...</option>
                            {devices.filter(n => n.id !== config.attackerId).map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Protocol</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded text-xs text-white p-2"
                            value={config.protocol}
                            onChange={e => setConfig({ ...config, protocol: e.target.value })}
                        >
                            <option value="TCP">TCP</option>
                            <option value="UDP">UDP</option>
                            <option value="ICMP">ICMP</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Port</label>
                        <input
                            type="number"
                            className="w-full bg-slate-950 border border-slate-700 rounded text-xs text-white p-2"
                            value={config.port}
                            onChange={e => setConfig({ ...config, port: parseInt(e.target.value) })}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isSimulating || !config.attackerId || !config.targetId}
                    className={`w-full py-2 rounded font-bold text-xs uppercase flex items-center justify-center gap-2 ${isSimulating
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                >
                    {isSimulating ? 'Sending Traffic...' : 'Simulate Attack'}
                </button>
            </div>

            {simulationResult && (
                <div className="border-t border-slate-800 pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400">Simulation Trace</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${simulationResult.outcome === 'BLOCKED' ? 'bg-red-500/20 text-red-500' :
                                simulationResult.outcome === 'ARRIVED' ? 'bg-green-500/20 text-green-500' : 'text-slate-500'
                            }`}>
                            {simulationResult.outcome}
                        </span>
                    </div>

                    <div className="space-y-1 max-h-40 overflow-y-auto">
                        {/* Display Message if failure */}
                        {!simulationResult.success && (
                            <div className="text-xs text-red-400 p-2 bg-red-900/10 border border-red-900/30 rounded">
                                {simulationResult.message}
                            </div>
                        )}

                        {/* Hop List */}
                        {simulationResult.trace && simulationResult.trace.map((step, idx) => (
                            <div key={idx} className={`text-[10px] p-2 rounded border border-l-2 flex flex-col gap-1 ${step.action === 'DROP' ? 'bg-red-950/30 border-slate-800 border-l-red-500' :
                                    step.action === 'FORWARD' && step.detections.length > 0 ? 'bg-yellow-950/30 border-slate-800 border-l-yellow-500' :
                                        'bg-slate-800 border-slate-700 border-l-blue-500'
                                }`}>
                                <div className="flex justify-between font-bold">
                                    <span className="text-slate-300">Hop {step.hop}: {step.node_id}</span>
                                    <span className={step.action === 'DROP' ? 'text-red-400' : 'text-green-500'}>{step.action}</span>
                                </div>
                                <div className="text-slate-500 italic">{step.details}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Builder Component ---

const KEY_NODES = 'hsafe_topology_nodes';
const KEY_EDGES = 'hsafe_topology_edges';

function TopologyBuilderContent() {
    const reactFlowWrapper = useRef(null);

    // Initialize from Local Storage or defaults
    const [nodes, setNodes, onNodesChange] = useNodesState(() => {
        const saved = localStorage.getItem(KEY_NODES);
        return saved ? JSON.parse(saved) : initialNodes;
    });
    const [edges, setEdges, onEdgesChange] = useEdgesState(() => {
        const saved = localStorage.getItem(KEY_EDGES);
        return saved ? JSON.parse(saved) : [];
    });

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [existingRules, setExistingRules] = useState([]);
    const [simulationResult, setSimulationResult] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

    // Persist changes
    React.useEffect(() => {
        if (nodes.length > 0) {
            localStorage.setItem(KEY_NODES, JSON.stringify(nodes));
        }
        // If nodes empty, maybe user cleared it? or it initialized empty. 
        // We handle explicit clear separately. 
        // But if user deletes all nodes manually, we should save empty array.
        // Let's rely on handleClear for "Reset to default" or just save whatever is there.
        // Actually, if we save [], next load will be empty. 
        // That's fine.
        localStorage.setItem(KEY_NODES, JSON.stringify(nodes));
    }, [nodes]);

    React.useEffect(() => {
        localStorage.setItem(KEY_EDGES, JSON.stringify(edges));
    }, [edges]);

    React.useEffect(() => {
        const fetchRules = async () => {
            try {
                const response = await fetch(`${API_URL}/rules?t=${Date.now()}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setExistingRules(data);
                }
            } catch (error) {
                console.error("Failed to fetch rules:", error);
            }
        };
        fetchRules();
    }, []);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff', strokeWidth: 2 } }, eds)),
        [],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/reactflow-label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: getId(),
                type,
                position,
                data: { label: `${label}`, ip: '' }, // Ensure IP field exists
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance],
    );

    // Node Selection
    const onNodeClick = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    // Update Node Data
    const updateNodeData = (nodeId, newData) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: { ...node.data, ...newData } };
                }
                return node;
            })
        );
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // --- Graph Traversal and Simulation Logic ---

    // BFS to find all paths between src and dst
    const findAllPaths = (sourceId, targetId, edges) => {
        const adj = {};
        edges.forEach(e => {
            if (!adj[e.source]) adj[e.source] = [];
            if (!adj[e.target]) adj[e.target] = [];
            adj[e.source].push(e.target);
            adj[e.target].push(e.source); // Assuming undirected links for simplicity in BFS
        });

        const paths = [];
        const queue = [[sourceId]];

        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];

            if (node === targetId) {
                // Convert path of IDs into list of edges (src, dst)
                const edgePath = [];
                for (let i = 0; i < path.length - 1; i++) {
                    edgePath.push([path[i], path[i + 1]]);
                    // Also add reverse for undirected consistency if backend needs check both ways
                    edgePath.push([path[i + 1], path[i]]);
                }
                paths.push(edgePath);
                continue; // Continue finding other paths? Simple BFS usually finds shortest. 
                // For complex topology with loops, we need visited checks.
            }

            // Simplistic BFS for quick implementation
            if (adj[node]) {
                for (const neighbor of adj[node]) {
                    if (!path.includes(neighbor)) {
                        queue.push([...path, neighbor]);
                    }
                }
            }
        }

        // Flatten list of lists of edges? 
        // Logic requires List of (src, dst).
        // If multiple paths exist, we should probably output all segments involved in valid paths.
        // Let's just collect ALL connected edges for now, or use the single path found.
        if (paths.length > 0) {
            return paths[0]; // Return the first (shortest) path segments
        }
        return [];
    };

    const handleRunSimulation = async (config) => {
        setIsSimulating(true);
        setSimulationResult(null);

        try {
            // 1. Construct Topology
            const topologyNodes = {};
            nodes.forEach(n => {
                // Determine node name/id. Backend expects `nodes` dict.
                // We'll use the ID as the key, and provide 'ip'.
                // If IP is missing, auto-assign one for simulation to work?
                // Let's use the ID as the reference name in the graph.
                topologyNodes[n.id] = {
                    ip: n.data.ip || `10.0.0.${n.id.replace(/\D/g, '') || 1}`, // Fallback IP
                    type: n.type
                };

                // If it's the firewall, map it specifically? 
                // The backend checks for a node named "firewall"!!! 
                // RE-READING backend code: `if "firewall" in topology["nodes"]`.
                // So one node MUST be named "firewall" (key in dict) for logic to enforce firewall traversal.
                // We need to map our H-Safe node ID to "firewall".
            });

            // Find H-Safe node to rename key to 'firewall'
            const hSafeNode = nodes.find(n => n.type === 'firewall');
            if (hSafeNode) {
                const originalId = hSafeNode.id;
                // Create alias in topology
                topologyNodes['firewall'] = topologyNodes[originalId];

                // Note: We need to handle edges. If edge connected to originalId, 
                // we must report it as connected to 'firewall'.
            }

            // Construct Paths
            // Backend expects `paths` as list of (src, dst).
            // We'll traverse the graph or just dump all edges?
            // `_path_exists` checks `(src, dst) in paths`.
            // So we need to provide all direct links as tuples.
            // AND we need to handle the ID mapping for firewall.

            const paths = [];
            edges.forEach(e => {
                let src = e.source;
                let dst = e.target;

                // Map to 'firewall' key if applicable
                if (hSafeNode && src === hSafeNode.id) src = 'firewall';
                if (hSafeNode && dst === hSafeNode.id) dst = 'firewall';

                paths.push([src, dst]);
                paths.push([dst, src]); // Bi-directional
            });

            // Map attacker/target IDs
            let attacker = config.attackerId;
            let target = config.targetId;
            if (hSafeNode && attacker === hSafeNode.id) attacker = 'firewall';
            if (hSafeNode && target === hSafeNode.id) target = 'firewall';

            const payload = {
                topology: {
                    nodes: topologyNodes,
                    paths: paths
                },
                attacker_node: attacker,
                target_node: target,
                protocol: config.protocol,
                dst_port: config.port
            };

            const response = await fetch(`${API_URL}/simulate/topology`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Simulation failed');
            }

            const result = await response.json();
            setSimulationResult(result);

        } catch (error) {
            console.error("Simulation error:", error);
            alert("Simulation Failed: " + error.message);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear the entire topology? This cannot be undone.")) {
            setNodes(initialNodes);
            setEdges([]);
            localStorage.removeItem(KEY_NODES);
            localStorage.removeItem(KEY_EDGES);
        }
    };

    return (
        <div className="flex h-[800px] border border-slate-700 rounded-xl overflow-hidden bg-slate-950 relative">
            <Sidebar />
            <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleClear}
                        className="px-3 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded flex items-center gap-2 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Topology
                    </button>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    proOptions={{ hideAttribution: true }}
                    fitView
                >
                    <Controls className="bg-slate-800 border border-slate-700 text-white fill-white" />
                    <Background color="#334155" gap={16} />
                    <MiniMap
                        nodeColor="#64748b"
                        maskColor="rgba(15, 23, 42, 0.7)"
                        className="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
                    />
                    <SimulationPanel
                        nodes={nodes}
                        onRunSimulation={handleRunSimulation}
                        simulationResult={simulationResult}
                        isSimulating={isSimulating}
                    />
                </ReactFlow>
            </div>
            <PropertiesPanel selectedNode={selectedNode} updateNodeData={updateNodeData} existingRules={existingRules} />
        </div>
    );
}

export default function TopologyBuilder() {
    return (
        <div className="space-y-4">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Network Topology Builder</h2>
                <p className="text-slate-400">
                    Design custom network architectures by dragging components onto the canvas.
                    Select a node to configure its IP address, role, and security policies.
                </p>
            </div>
            <ReactFlowProvider>
                <TopologyBuilderContent />
            </ReactFlowProvider>
        </div>
    );
}
