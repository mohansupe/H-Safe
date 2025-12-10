import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUser } from '@clerk/clerk-react';
import RulesAddition from '../components/simulator/RulesAddition';
import RulesImplementation from '../components/simulator/RulesImplementation';
import PcapAnalysis from '../components/simulator/PcapAnalysis';

export default function Simulator() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('addition');
    const [rules, setRules] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [newRule, setNewRule] = useState({
        name: '',
        type: 'IP',
        condition: '',
        source_ip: '',
        destination_ip: '',
        port: '',
        action: 'Flag'
    });

    // PCAP Analysis State
    const [pcapFile, setPcapFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([]);

    // Fetch rules on mount
    useEffect(() => {
        if (user) {
            fetchRules();
        }
    }, [user]);

    // Simulation loop
    useEffect(() => {
        let interval;
        if (isSimulating) {
            interval = setInterval(() => {
                generateTraffic();
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isSimulating, rules]);

    const fetchRules = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('security_rules')
            .select('*')
            .eq('status', 'Active')
            .eq('user_id', user.id);

        if (data) setRules(data);
    };

    const handleAddRule = async (e, actionType) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to add a rule.');
            return;
        }

        let finalCondition = newRule.condition;
        if (newRule.type === 'IP') {
            finalCondition = JSON.stringify({
                source: newRule.source_ip,
                dest: newRule.destination_ip,
                port: newRule.port
            });
        }

        const ruleToInsert = {
            name: newRule.name,
            type: newRule.type,
            condition: finalCondition,
            action: actionType,
            user_id: user.id
        };

        const { data, error } = await supabase
            .from('security_rules')
            .insert([ruleToInsert])
            .select();

        if (!error && data) {
            setRules([...rules, data[0]]);
            setNewRule({ name: '', type: 'IP', condition: '', source_ip: '', destination_ip: '', port: '', action: 'Flag' });
            alert(`Rule added successfully with action: ${actionType}`);
        } else {
            console.error('Error adding rule:', error);
            alert('Failed to add rule. Ensure database table exists.');
        }
    };

    const handleDeleteRule = async (id) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;

        const { error } = await supabase
            .from('security_rules')
            .delete()
            .eq('id', id);

        if (!error) {
            setRules(rules.filter(rule => rule.id !== id));
        } else {
            console.error('Error deleting rule:', error);
            alert('Failed to delete rule.');
        }
    };

    const generateTraffic = () => {
        const types = ['IP', 'Protocol', 'Port', 'Signature'];

        // Random traffic generation
        const traffic = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            destination_ip: `10.0.0.${Math.floor(Math.random() * 255)}`,
            protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
            port: Math.floor(Math.random() * 65535),
            status: 'Allowed' // Default
        };

        // Check against rules
        let matchedRule = null;
        for (const rule of rules) {
            if (rule.type === 'IP') {
                try {
                    const condition = JSON.parse(rule.condition);
                    const sourceMatch = !condition.source || traffic.source_ip.includes(condition.source);
                    const destMatch = !condition.dest || traffic.destination_ip.includes(condition.dest);
                    const portMatch = !condition.port || traffic.port.toString() === condition.port;

                    if (sourceMatch && destMatch && portMatch) {
                        matchedRule = rule;
                    }
                } catch (e) {
                    // Fallback for old rules or plain text
                    if (traffic.source_ip.includes(rule.condition) || traffic.destination_ip.includes(rule.condition)) {
                        matchedRule = rule;
                    }
                }
            } else if (rule.type === 'Protocol' && traffic.protocol === rule.condition) {
                matchedRule = rule;
            } else if (rule.type === 'Port' && traffic.port.toString() === rule.condition) {
                matchedRule = rule;
            }
            // Simple signature match simulation
            else if (rule.type === 'Signature' && Math.random() > 0.8) {
                matchedRule = rule;
            }

            if (matchedRule) break;
        }

        if (matchedRule) {
            traffic.status = `${matchedRule.action} (Rule: ${matchedRule.name})`;
            if (matchedRule.action === 'Reject' || matchedRule.action === 'Block') {
                traffic.alert = true;
            } else {
                traffic.alert = false; // Allow or Log shouldn't necessarily be red
            }
        }

        setLogs(prev => [traffic, ...prev].slice(0, 50)); // Keep last 50 logs
    };

    const formatRuleCondition = (rule) => {
        if (rule.type === 'IP') {
            try {
                const c = JSON.parse(rule.condition);
                return `Source: ${c.source || '*'}, Dest: ${c.dest || '*'}, Port: ${c.port || '*'}`;
            } catch (e) {
                return rule.condition;
            }
        }
        return rule.condition;
    };

    // PCAP Analysis Logic
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPcapFile(file);
            setAnalysisResults([]);
        }
    };

    const analyzePCAP = async () => {
        if (!pcapFile) return;
        setIsAnalyzing(true);
        setAnalysisResults([]);

        const formData = new FormData();
        formData.append('file', pcapFile);

        try {
            const response = await fetch('http://localhost:8000/analyze-pcap', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis failed');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    console.log('Stream complete');
                    break;
                }

                console.log('Received chunk size:', value.length);
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');

                // Process all complete lines
                buffer = lines.pop(); // Keep the last incomplete line in buffer

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const packet = JSON.parse(line);
                            if (packet.error) {
                                console.error('Backend error:', packet.error);
                            } else {
                                setAnalysisResults(prev => [...prev, packet]);
                            }
                        } catch (e) {
                            console.error('Error parsing JSON chunk:', e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error analyzing PCAP:', error);
            alert(`Analysis failed: ${error.message}. Make sure the Python backend is running.`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
                    H-SAFE Network Simulator
                </h1>

                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('addition')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === 'addition'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Rules Addition
                    </button>
                    <button
                        onClick={() => setActiveTab('implementation')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === 'implementation'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        Rules Implementation
                    </button>
                    <button
                        onClick={() => setActiveTab('pcap')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === 'pcap'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        PCAP Analysis
                    </button>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-xl">
                    {activeTab === 'addition' && (
                        <RulesAddition
                            newRule={newRule}
                            setNewRule={setNewRule}
                            handleAddRule={handleAddRule}
                        />
                    )}

                    {activeTab === 'implementation' && (
                        <RulesImplementation
                            logs={logs}
                            rules={rules}
                            isSimulating={isSimulating}
                            setIsSimulating={setIsSimulating}
                            handleDeleteRule={handleDeleteRule}
                            formatRuleCondition={formatRuleCondition}
                        />
                    )}

                    {activeTab === 'pcap' && (
                        <PcapAnalysis
                            pcapFile={pcapFile}
                            isAnalyzing={isAnalyzing}
                            analysisResults={analysisResults}
                            handleFileUpload={handleFileUpload}
                            analyzePCAP={analyzePCAP}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
