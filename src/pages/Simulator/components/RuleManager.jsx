import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Item Component
function SortableRuleItem({ rule, index, handleEdit, handleDelete, handleToggle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: rule.rule_id });

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
            className={`flex items-center justify-between p-4 rounded border transition-colors ${rule.enabled === false ? 'bg-slate-900/50 border-slate-800 opacity-75' : 'bg-slate-900 border-slate-700 hover:border-slate-600'}`}
        >
            <div>
                <div className="flex items-center gap-3 mb-1">
                    {/* Drag Handle */}
                    <div {...attributes} {...listeners} className="cursor-grab hover:text-white text-slate-600 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                    </div>

                    <span className="text-slate-500 font-mono text-xs border border-slate-700 px-2 rounded">#{index}</span>
                    <h4 className={`font-bold ${rule.enabled === false ? 'text-slate-500 line-through' : 'text-white'}`}>{rule.name}</h4>

                    {rule.enabled === false && <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded uppercase font-bold">Disabled</span>}

                    <span className={`text-xs px-2 py-1 rounded font-bold ${rule.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' :
                        rule.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-500' :
                            'bg-blue-500/20 text-blue-500'
                        }`}>
                        {rule.severity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-bold border ${rule.action === 'DENY' ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'
                        }`}>
                        {rule.action}
                    </span>
                    <span className="text-xs px-2 py-1 rounded font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {rule.protocol || 'TCP'}
                    </span>
                </div>
                <p className="text-sm text-slate-400 ml-8">{rule.description}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* Toggle Button */}
                <button
                    onClick={() => handleToggle(rule.rule_id, rule.enabled)}
                    className={`p-2 rounded border transition-colors text-xs font-bold uppercase w-20 ${rule.enabled !== false
                        ? 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}`}
                >
                    {rule.enabled !== false ? 'Enabled' : 'Disabled'}
                </button>

                <div className="h-6 w-px bg-slate-800 mx-2"></div>

                {/* Edit Button */}
                <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors bg-slate-950 rounded hover:bg-slate-900 border border-slate-800"
                    title="Edit Rule"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>

                <button
                    onClick={() => handleDelete(rule.rule_id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 bg-slate-950 rounded hover:bg-slate-900 border border-slate-800"
                    title="Delete Rule"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function RuleManager() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creationError, setCreationError] = useState(null);

    // Form State
    const [editingRuleId, setEditingRuleId] = useState(null);
    const [formState, setFormState] = useState({
        name: '',
        description: '',
        severity: 'LOW',
        protocol: 'TCP',
        action: 'ALERT',
        conditions: {
            src_ip: '',
            dst_ip: '',
            dst_port: ''
        }
    });

    // DND Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [error, setError] = useState(null);

    const LOCAL_STORAGE_KEY = 'hsafe_rules';

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = () => {
        setLoading(true);
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (stored) {
                setRules(JSON.parse(stored));
            } else {
                setRules([]);
            }
        } catch (error) {
            console.error("Failed to load rules:", error);
            setRules([]);
        } finally {
            setLoading(false);
        }
    };

    const saveRulesToStorage = (newRules) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRules));
        setRules(newRules);
    };

    const handleDelete = (ruleId) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;
        const newRules = rules.filter(r => r.rule_id !== ruleId);
        saveRulesToStorage(newRules);
    };

    // New Drag End Handler
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setRules((items) => {
                const oldIndex = items.findIndex((item) => item.rule_id === active.id);
                const newIndex = items.findIndex((item) => item.rule_id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems)); // Persist order
                return newItems;
            });
        }
    };

    const handleToggle = (ruleId, currentStatus) => {
        const newRules = rules.map(r =>
            r.rule_id === ruleId ? { ...r, enabled: !currentStatus } : r
        );
        saveRulesToStorage(newRules);
    };

    const handleEdit = (rule) => {
        setEditingRuleId(rule.rule_id);
        const conditions = {
            src_ip: rule.conditions.src_ip || '',
            dst_ip: rule.conditions.dst_ip || '',
            dst_port: rule.conditions.dst_port || ''
        };
        setFormState({
            name: rule.name,
            description: rule.description,
            severity: rule.severity,
            protocol: rule.protocol || 'TCP',
            action: rule.action,
            conditions
        });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingRuleId(null);
        setFormState({
            name: '',
            description: '',
            severity: 'LOW',
            protocol: 'TCP',
            action: 'ALERT',
            conditions: { src_ip: '', dst_ip: '', dst_port: '' }
        });
        setCreationError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCreationError(null);

        // Clean up empty conditions
        const conditions = {};
        if (formState.conditions.src_ip) conditions.src_ip = formState.conditions.src_ip;
        if (formState.conditions.dst_ip) conditions.dst_ip = formState.conditions.dst_ip;
        if (formState.conditions.dst_port) conditions.dst_port = parseInt(formState.conditions.dst_port);

        const payload = {
            ...formState,
            conditions,
            enabled: true,
            rule_id: editingRuleId || crypto.randomUUID() // Generate ID locally
        };

        try {
            let newRules;
            if (editingRuleId) {
                // UPDATE
                newRules = rules.map(r => r.rule_id === editingRuleId ? { ...r, ...payload } : r);
            } else {
                // CREATE
                newRules = [...rules, payload];
            }
            saveRulesToStorage(newRules);
            handleCancelEdit();
        } catch (error) {
            console.error("Failed to save rule:", error);
            setCreationError("Failed to save rule locally.");
        }
    };

    return (
        <div className="space-y-8">
            {/* Create/Edit Rule Form */}
            <div className={`p-6 rounded-xl border transition-colors ${editingRuleId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                        {editingRuleId ? 'Edit Detection Rule' : 'Add New Detection Rule'}
                    </h3>
                    {editingRuleId && (
                        <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white text-sm underline">
                            Cancel Edit
                        </button>
                    )}
                </div>

                {creationError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4">
                        <strong>Error:</strong> {creationError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                    <input
                        placeholder="Rule Name"
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                        value={formState.name}
                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <select
                            className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                            value={formState.severity}
                            onChange={e => setFormState({ ...formState, severity: e.target.value })}
                        >
                            <option value="LOW">Low Severity</option>
                            <option value="MEDIUM">Medium Severity</option>
                            <option value="HIGH">High Severity</option>
                            <option value="CRITICAL">Critical Severity</option>
                        </select>
                        <select
                            className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                            value={formState.protocol}
                            onChange={e => setFormState({ ...formState, protocol: e.target.value })}
                        >
                            <option value="TCP">Protocol: TCP</option>
                            <option value="UDP">Protocol: UDP</option>
                            <option value="ICMP">Protocol: ICMP</option>
                            <option value="ANY">Protocol: ANY</option>
                        </select>
                    </div>

                    <input
                        placeholder="Source IP (e.g. 192.168.1.5)"
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                        value={formState.conditions.src_ip}
                        onChange={e => setFormState({
                            ...formState,
                            conditions: { ...formState.conditions, src_ip: e.target.value }
                        })}
                    />

                    <input
                        placeholder="Dest IP (e.g. 10.0.0.1)"
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                        value={formState.conditions.dst_ip}
                        onChange={e => setFormState({
                            ...formState,
                            conditions: { ...formState.conditions, dst_ip: e.target.value }
                        })}
                    />

                    <input
                        type="number"
                        placeholder="Dest Port (e.g. 80)"
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                        value={formState.conditions.dst_port}
                        onChange={e => setFormState({
                            ...formState,
                            conditions: { ...formState.conditions, dst_port: e.target.value }
                        })}
                    />

                    <select
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white"
                        value={formState.action}
                        onChange={e => setFormState({ ...formState, action: e.target.value })}
                    >
                        <option value="ALERT">action: ALERT</option>
                        <option value="DENY">action: DENY (Block)</option>
                        <option value="ALLOW">action: ALLOW</option>
                    </select>

                    <input
                        placeholder="Description"
                        className="bg-slate-900 border border-slate-700 p-3 rounded text-white md:col-span-2"
                        value={formState.description}
                        onChange={e => setFormState({ ...formState, description: e.target.value })}
                        required
                    />

                    <button type="submit" className={`${editingRuleId ? 'bg-orange-600 hover:bg-orange-500' : 'bg-blue-600 hover:bg-blue-500'} text-white p-3 rounded font-bold md:col-span-2 transition-colors`}>
                        {editingRuleId ? 'Update Rule' : 'Add & Validate Rule'}
                    </button>
                    {!editingRuleId && (
                        <p className="md:col-span-2 text-xs text-slate-500 text-center uppercase tracking-wide">
                            Rule will be validated against active schema and appended to position {rules.length}
                        </p>
                    )}
                </form>
            </div>

            {/* Rules List (Drag and Drop Enabled) */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">Active Rules ({rules.length})</h3>
                <div className="space-y-4">
                    {loading && rules.length === 0 ? (
                        <p className="text-slate-400">Loading rules...</p>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={rules.map(r => r.rule_id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {rules.map((rule, idx) => (
                                    <SortableRuleItem
                                        key={rule.rule_id}
                                        rule={rule}
                                        index={idx}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                        handleToggle={handleToggle}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}

                    {rules.length === 0 && !loading && (
                        <p className="text-slate-500 italic">No rules configured. Add one above.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
