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
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Monitor,
    Server,
    Router,
    ShieldCheck,
    Cloud,
    Database,
    Smartphone,
    Wifi,
    Trash2,
    GripVertical,
    Edit2
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

const Sidebar = ({ onGenerate }) => {
    const [genType, setGenType] = useState('simple');

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
        <aside className="w-64 bg-slate-900 border-r border-slate-700 p-4 h-full flex flex-col overflow-y-auto">
            <h3 className="text-white font-bold mb-4 text-lg">Toolkit</h3>

            {/* GENERATOR SECTION */}
            <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
                <div className="text-xs font-bold text-blue-400 uppercase mb-2">Auto-Generate</div>
                <select
                    className="w-full bg-slate-950 text-white text-xs p-2 rounded border border-slate-700 mb-2"
                    value={genType}
                    onChange={(e) => setGenType(e.target.value)}
                >
                    <option value="simple">Simple Office</option>
                    <option value="dmz">Secure DMZ</option>
                    <option value="cloud">Cloud Hybrid</option>
                    <option value="star">Star Topology</option>
                    <option value="bus">Bus Topology</option>
                    <option value="mesh">Mesh Topology</option>
                    <option value="ring">Ring Topology</option>
                </select>
                <button
                    onClick={() => onGenerate(genType)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded shadow-lg transition-colors"
                >
                    Generate Layout
                </button>
            </div>

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

// Helper to strip CIDR suffix
const sanitizeIp = (ip) => {
    if (!ip) return '';
    return ip.split('/')[0];
};

const getNodeIp = (node) => {
    if (!node) return null;
    const cleanIp = sanitizeIp(node.data.ip);
    if (cleanIp) return cleanIp;

    // Fallback: Hash the ID to get a unique last octet (1-254)
    // This ensures that "Internet", "cloud", etc. get distinct IPs even if they don't have numbers in IDs
    let hash = 0;
    const str = node.id || '';
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const uniqueOctet = (Math.abs(hash) % 254) + 1;
    return `10.0.0.${uniqueOctet}`;
};

// --- Properties Panel ---

// --- Sortable Item Component ---
const SortableRuleItem = ({ rule, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: rule.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between mb-2 last:mb-0 bg-slate-900 p-2 rounded border border-slate-800 group"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                {/* Drag Handle */}
                <div {...attributes} {...listeners} className="cursor-grab text-slate-600 hover:text-slate-400">
                    <GripVertical className="w-3 h-3" />
                </div>

                <div className="flex flex-col truncate">
                    <span className={`text-[10px] font-bold flex gap-2 ${rule.action === 'ALLOW' ? 'text-green-500' : 'text-red-500'}`}>
                        [{rule.action}] <span className="text-slate-300 truncate">{rule.name}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 truncate">
                        {rule.conditions.src_ip || '*'} &rarr; {rule.conditions.dst_ip || '*'}:{rule.conditions.dst_port || '*'}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(rule)}
                    className="text-slate-500 hover:text-blue-400 p-1"
                >
                    <Edit2 className="w-3 h-3" />
                </button>
                <button
                    onClick={() => onDelete(rule.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};

const PropertiesPanel = ({ selectedNode, updateNodeData, nodes }) => {
    // State for local rule form
    const [ruleForm, setRuleForm] = useState({
        name: '',
        description: '',
        severity: 'LOW',
        action: 'ALERT',
        protocol: 'TCP',
        src_id: '',
        dst_id: '',
        dst_port: ''
    });
    const [editingId, setEditingId] = useState(null);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
    );

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

    const handleFormChange = (field, value) => {
        setRuleForm(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setRuleForm({
            name: '',
            description: '',
            severity: 'LOW',
            action: 'ALERT',
            protocol: 'TCP',
            src_id: '',
            dst_id: '',
            dst_port: ''
        });
        setEditingId(null);
    };

    const handleAddOrUpdateRule = () => {
        // Find IPs from selected IDs
        const srcNode = nodes.find(n => n.id === ruleForm.src_id);
        const dstNode = nodes.find(n => n.id === ruleForm.dst_id);
        const srcIp = getNodeIp(srcNode) || ruleForm.src_id;
        const dstIp = getNodeIp(dstNode) || ruleForm.dst_id;

        if (!srcIp || !dstIp) {
            alert("Please select valid Source and Destination devices.");
            return;
        }

        const ruleData = {
            id: editingId || `rule_${Date.now()}`,
            rule_id: editingId || `rule_${Date.now()}`, // Keep compatible
            enabled: true,
            name: ruleForm.name || `Rule ${Date.now()}`,
            description: ruleForm.description,
            severity: ruleForm.severity,
            action: ruleForm.action,
            protocol: ruleForm.protocol === 'ANY' ? null : ruleForm.protocol,
            // Store IDs for editing
            src_id: ruleForm.src_id,
            dst_id: ruleForm.dst_id,
            conditions: {
                src_ip: srcIp === 'ANY' ? null : srcIp,
                dst_ip: dstIp === 'ANY' ? null : dstIp,
                dst_port: ruleForm.dst_port ? parseInt(ruleForm.dst_port) : null,
                source_ip: srcIp === 'ANY' ? null : srcIp,
                destination_ip: dstIp === 'ANY' ? null : dstIp
            }
        };

        const currentRules = selectedNode.data.customRules || [];
        let newRules;

        if (editingId) {
            newRules = currentRules.map(r => r.id === editingId ? ruleData : r);
        } else {
            newRules = [...currentRules, ruleData];
        }

        updateNodeData(selectedNode.id, { customRules: newRules });
        resetForm();
    };

    const handleEditClick = (rule) => {
        setEditingId(rule.id);
        setRuleForm({
            name: rule.name || '',
            description: rule.description || '',
            severity: rule.severity || 'LOW',
            action: rule.action || 'ALERT',
            protocol: rule.protocol || 'TCP',
            // Try to restore IDs if saved, else fallback to 'ANY' if no ID found
            src_id: rule.src_id || '',
            dst_id: rule.dst_id || '',
            dst_port: rule.conditions.dst_port || ''
        });
    };

    const handleDeleteClick = (ruleId) => {
        const currentRules = selectedNode.data.customRules || [];
        updateNodeData(selectedNode.id, { customRules: currentRules.filter(r => r.id !== ruleId) });
        if (editingId === ruleId) resetForm();
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const currentRules = selectedNode.data.customRules || [];
            const oldIndex = currentRules.findIndex(r => r.id === active.id);
            const newIndex = currentRules.findIndex(r => r.id === over.id);
            updateNodeData(selectedNode.id, { customRules: arrayMove(currentRules, oldIndex, newIndex) });
        }
    };

    // Filter potential targets for dropdowns
    const potentialTargets = nodes ? nodes.filter(n => ['host', 'server', 'cloud', 'router', 'switch'].includes(n.type)) : [];

    const activeRules = selectedNode.data.customRules || [];

    return (
        <aside className="w-72 bg-slate-900 border-l border-slate-700 p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
                <div className={`p-2 rounded bg-slate-800 border border-slate-700`}>
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
                        <label className="text-xs font-bold text-red-500 uppercase">H-Safe Rules</label>

                        {/* Rule Form */}
                        <div className={`bg-slate-950 border ${editingId ? 'border-blue-600' : 'border-slate-800'} rounded p-3 space-y-2`}>
                            <input
                                placeholder="Rule Name"
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white"
                                value={ruleForm.name}
                                onChange={e => handleFormChange('name', e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    className="bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-700"
                                    value={ruleForm.action}
                                    onChange={e => handleFormChange('action', e.target.value)}
                                >
                                    <option value="ALERT">ALERT</option>
                                    <option value="DENY">DENY</option>
                                    <option value="ALLOW">ALLOW</option>
                                </select>
                                <select
                                    className="bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-700"
                                    value={ruleForm.severity}
                                    onChange={e => handleFormChange('severity', e.target.value)}
                                >
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                    <option value="CRITICAL">CRITICAL</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    className="bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-700"
                                    value={ruleForm.protocol}
                                    onChange={e => handleFormChange('protocol', e.target.value)}
                                >
                                    <option value="TCP">TCP</option>
                                    <option value="UDP">UDP</option>
                                    <option value="ICMP">ICMP</option>
                                    <option value="ANY">ANY</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Dst Port"
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-[10px] text-white"
                                    value={ruleForm.dst_port}
                                    onChange={e => handleFormChange('dst_port', e.target.value)}
                                />
                            </div>

                            {/* Source Dropdown */}
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-1">Source</label>
                                <select
                                    className="w-full bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-700"
                                    value={ruleForm.src_id}
                                    onChange={e => handleFormChange('src_id', e.target.value)}
                                >
                                    <option value="">Select Source...</option>
                                    <option value="ANY">Any IP (*)</option>
                                    {potentialTargets.map(n => (
                                        <option key={n.id} value={n.id}>{n.data.label} ({getNodeIp(n) || 'No IP'})</option>
                                    ))}
                                </select>
                            </div>

                            {/* Destination Dropdown */}
                            <div>
                                <label className="text-[10px] text-slate-500 block mb-1">Destination</label>
                                <select
                                    className="w-full bg-slate-900 text-white text-[10px] p-1 rounded border border-slate-700"
                                    value={ruleForm.dst_id}
                                    onChange={e => handleFormChange('dst_id', e.target.value)}
                                >
                                    <option value="">Select Dest...</option>
                                    <option value="ANY">Any IP (*)</option>
                                    {potentialTargets.map(n => (
                                        <option key={n.id} value={n.id}>{n.data.label} ({getNodeIp(n) || 'No IP'})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={handleAddOrUpdateRule}
                                    className={`flex-1 py-1 text-white text-[10px] font-bold rounded ${editingId ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                                >
                                    {editingId ? 'Update Rule' : 'Add Rule'}
                                </button>
                                {editingId && (
                                    <button
                                        onClick={resetForm}
                                        className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Rules List (Draggable) */}
                        <div className="bg-slate-950 border border-slate-800 rounded p-2 max-h-40 overflow-y-auto">
                            {activeRules.length === 0 ? (
                                <div className="text-xs text-slate-500 text-center py-2">No manual rules added.</div>
                            ) : (
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={activeRules.map(r => r.id)} strategy={verticalListSortingStrategy}>
                                        {activeRules.map((rule) => (
                                            <SortableRuleItem
                                                key={rule.id}
                                                rule={rule}
                                                onEdit={handleEditClick}
                                                onDelete={handleDeleteClick}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>
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

    // Rule fetching removed for standalone manual rule entry

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
                    ip: getNodeIp(n),
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

            // 5. Gather Selected Rules
            // Use customRules from H-Safe node data
            let selectedRules = [];
            if (hSafeNode && hSafeNode.data.customRules && hSafeNode.data.customRules.length > 0) {
                selectedRules = hSafeNode.data.customRules;
            } else {
                selectedRules = [];
            }
            // However, if NO firewall node, rules are irrelevant.

            const payload = {
                topology: {
                    nodes: topologyNodes,
                    paths: paths
                },
                attacker_node: attacker,
                target_node: target,
                protocol: config.protocol,
                dst_port: config.port,
                rules: selectedRules // Pass selected rules
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

    const handleGenerate = async (type) => {
        if (!window.confirm("Generating a new topology will clear the current canvas. Continue?")) return;

        try {
            const res = await fetch(`${API_URL}/simulate/topology/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: type, params: {} })
            });

            if (!res.ok) throw new Error("Failed to generate topology");

            const data = await res.json();

            // Map Nodes
            const newNodes = data.nodes.map(n => ({
                id: n.id,
                type: n.type === 'internet' ? 'cloud' : n.type, // Map backend type 'internet' to frontend 'cloud'
                position: n.position,
                data: {
                    label: n.name,
                    ip: n.metadata.ip,
                    subnet: n.metadata.subnet,
                    gateway: '', // not in metadata default?
                    activeRules: []
                }
            }));

            // Map Edges
            const newEdges = data.links.map(l => ({
                id: l.id,
                source: l.source_node_id,
                target: l.destination_node_id,
                animated: true,
                style: { stroke: '#fff', strokeWidth: 2 },
                type: 'default'
            }));

            setNodes(newNodes);
            setEdges(newEdges);

            // Reset simulation if any
            setSimulationResult(null);

        } catch (err) {
            console.error(err);
            alert("Error generating topology: " + err.message);
        }
    };

    return (
        <div className="flex h-[800px] border border-slate-700 rounded-xl overflow-hidden bg-slate-950 relative">
            <Sidebar onGenerate={handleGenerate} />
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
            <PropertiesPanel selectedNode={selectedNode} updateNodeData={updateNodeData} nodes={nodes} />
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
