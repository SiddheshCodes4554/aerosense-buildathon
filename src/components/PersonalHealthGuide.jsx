import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Shield,
    Activity,
    Wind,
    Droplets,
    Home,
    Car,
    Briefcase,
    AlertCircle,
    CheckCircle2,
    Loader2,
    RefreshCw,
    MoreVertical
} from 'lucide-react';
import { fetchHealthGuide } from '../services/groqService';
import { useUserStore } from '../store/useUserStore';

const PersonalHealthGuide = ({ aqiData, isIndoor }) => {
    const { healthProfile, locationType } = useUserStore();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activityType, setActivityType] = useState(isIndoor ? 'Indoor' : 'Outdoor');

    const performAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await fetchHealthGuide({
                aqi: aqiData.aqi,
                category: aqiData.advice.status,
                pollutant: Object.keys(aqiData.pollutants)[0],
                healthProfile,
                locationType,
                activityType
            });
            if (results) {
                setAnalysis(results);
            } else {
                throw new Error("No analysis returned from AI");
            }
        } catch (error) {
            console.error("Health Guide Error:", error);
            setError(error.message || "Failed to generate health plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!analysis && aqiData) {
            performAnalysis();
        }
    }, [aqiData, activityType, healthProfile, locationType]);

    const getRiskColor = (level) => {
        switch (level?.toUpperCase()) {
            case 'LOW': return 'text-primary bg-primary/10 border-primary/20';
            case 'MEDIUM': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-white/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="flex flex-col h-full uppercase-text-fix">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                        <Heart className="text-red-500" size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-none italic uppercase tracking-tighter text-white">
                            Personal Health<span className="text-red-500 not-italic">Guide</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Bio-Dynamic Intelligence</span>
                            <div className="w-1 h-1 rounded-full bg-red-500/40" />
                            <span className="text-[8px] font-mono text-red-500 uppercase tracking-[0.2em] animate-pulse">Analyzing Vitals</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-white/60 focus:outline-none focus:border-red-500/50"
                    >
                        <option value="Indoor">Indoor</option>
                        <option value="Outdoor">Outdoor</option>
                        <option value="Work commute">Commute</option>
                    </select>
                    <button
                        onClick={performAnalysis}
                        className="p-2.5 rounded-xl glass border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                    <Loader2 className="text-red-500 animate-spin mb-4" size={32} />
                    <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] animate-pulse text-center">Applying Healthcare Reasoning Models...</p>
                </div>
            ) : analysis ? (
                <div className="space-y-6 flex-1">
                    {/* Risk & Summary */}
                    <div className="p-5 rounded-3xl border relative overflow-hidden group transition-all duration-500" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)' }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                                    <Shield className="text-white/40" size={16} />
                                </div>
                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Health Risk Assessment</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRiskColor(analysis.riskLevel)}`}>
                                {analysis.riskLevel} Risk
                            </div>
                        </div>
                        <p className="text-sm font-bold text-white leading-relaxed italic">
                            "{analysis.summary}"
                        </p>
                    </div>

                    {/* Recommendations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RecommendationCard
                            icon={<Activity size={16} />}
                            title="Outdoor Behavior"
                            text={analysis.recommendations.outdoor}
                            color="blue"
                        />
                        <RecommendationCard
                            icon={<Wind size={16} />}
                            title="Air Protection"
                            text={analysis.recommendations.mask}
                            color="amber"
                        />
                        <RecommendationCard
                            icon={<Droplets size={16} />}
                            title="Hydration & Breathing"
                            text={analysis.recommendations.breathing}
                            color="cyan"
                        />
                        <RecommendationCard
                            icon={<Home size={16} />}
                            title="Indoor Lifestyle"
                            text={analysis.recommendations.indoor}
                            color="emerald"
                        />
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                    <button onClick={performAnalysis} className="flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Heart className="text-red-500" size={32} />
                        </div>
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                            {error ? <span className="text-red-400">{error}</span> : "Generate My Health Plan"}
                        </span>
                        {error && (
                            <span className="text-[10px] text-white/20 mt-2 uppercase tracking-tighter">Click to retry</span>
                        )}
                    </button>
                </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-3">
                <AlertCircle className="text-white/20 shrink-0" size={14} />
                <p className="text-[9px] font-mono text-white/20 leading-tight uppercase tracking-widest">
                    AI Guidance only. This is not a medical diagnosis. Consult a physician for health concerns.
                </p>
            </div>
        </div>
    );
};

const RecommendationCard = ({ icon, title, text, color }) => {
    const colors = {
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
        cyan: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
        emerald: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    };

    return (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">{title}</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
                {text}
            </p>
        </div>
    );
};

export default PersonalHealthGuide;
