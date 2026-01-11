import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Dna,
    Car,
    Factory,
    HardHat,
    Flame,
    Wind,
    ShieldCheck,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { fetchChemicalFingerprint } from '../services/groqService';

const ChemicalFingerprintAI = ({ pollutants }) => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await fetchChemicalFingerprint(pollutants);
            if (results) {
                setAnalysis(results);
            } else {
                throw new Error("Analysis failed");
            }
        } catch (error) {
            console.error("Chemical Fingerprint Error:", error);
            setError("Analysis failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!analysis && pollutants) {
            performAnalysis();
        }
    }, [pollutants]);

    const getIcon = (type) => {
        const t = type.toLowerCase();
        if (t.includes('vehicle') || t.includes('traffic')) return <Car />;
        if (t.includes('industrial') || t.includes('coal')) return <Factory />;
        if (t.includes('dust') || t.includes('construction')) return <HardHat />;
        if (t.includes('smoke') || t.includes('fire') || t.includes('combustion')) return <Flame />;
        return <Wind />;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="text-primary animate-spin mb-4" size={32} />
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] animate-pulse">Scanning Molecular Ratios...</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Dna className="text-primary" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-widest text-white/40">Chemical Fingerprint</h3>
                        <div className="text-primary font-black text-lg leading-tight">{analysis.type}</div>
                    </div>
                </div>
                <button
                    onClick={performAnalysis}
                    className={`p-2 rounded-lg transition-colors ${error ? 'text-red-500' : 'text-white/10 hover:text-white'}`}
                    title={error || "Refresh Analysis"}
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <p className="text-xs text-white/60 leading-relaxed italic mb-8">
                "{analysis.description}"
            </p>

            <div className="space-y-6 flex-1">
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Molecular Composition</span>
                        <span className="text-[10px] font-mono text-primary font-bold">AI Verified</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden flex">
                        {analysis.composition.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ width: 0 }}
                                animate={{ width: `${item.percentage}%` }}
                                transition={{ duration: 1, delay: 0.1 * idx }}
                                className="h-full relative group"
                                style={{ backgroundColor: item.color }}
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] whitespace-nowrap mb-2">
                                    {item.name}: {item.percentage}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3">
                        {analysis.composition.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-[9px] font-medium text-white/50">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="text-primary/40" size={14} />
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Confidence Index:</span>
                </div>
                <div className="text-xs font-bold text-white/60">{analysis.confidence}%</div>
            </div>
        </div>
    );
};

export default ChemicalFingerprintAI;
