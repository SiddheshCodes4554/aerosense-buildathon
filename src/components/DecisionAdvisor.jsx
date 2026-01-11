import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    User,
    MapPin,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Clock,
    Home,
    Loader2,
    Settings2,
    AlertCircle
} from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { fetchDecisionAdvisor } from '../services/groqService';

const DecisionAdvisor = ({ aqiData }) => {
    const { healthProfile, setHealthProfile, locationType, setLocationType } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [advice, setAdvice] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    const getAdvice = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchDecisionAdvisor({
                aqi: aqiData.aqi,
                category: aqiData.advice.status,
                pollutant: Object.keys(aqiData.pollutants)[0],
                wind: aqiData.wind.speed,
                temp: aqiData.weather.temp,
                healthProfile,
                locationType
            });
            if (result) {
                setAdvice(result);
            } else {
                throw new Error("No advice returned from AI");
            }
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to get advice. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const profiles = ['Normal', 'Child', 'Elderly', 'Asthma'];
    const zones = ['Urban', 'Residential', 'Roadside'];

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                        <Zap className="text-primary" size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight text-white">Decision Advisor</h3>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Powered by Llama-3 AI</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-primary/20 text-primary' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                >
                    <Settings2 size={20} />
                </button>
            </div>

            {/* Profile Settings */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-6"
                    >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <div>
                                <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 block">Health Profile</label>
                                <div className="flex flex-wrap gap-2">
                                    {profiles.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setHealthProfile(p)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${healthProfile === p ? 'bg-primary text-black' : 'bg-white/5 text-white/40 hover:text-white'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 block">Environment Zone</label>
                                <div className="flex flex-wrap gap-2">
                                    {zones.map(z => (
                                        <button
                                            key={z}
                                            onClick={() => setLocationType(z)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${locationType === z ? 'bg-primary text-black' : 'bg-white/5 text-white/40 hover:text-white'
                                                }`}
                                        >
                                            {z}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!advice ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-3xl">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <AlertCircle className="text-white/20" size={32} />
                    </div>
                    <h4 className="text-white font-bold mb-2">Ready for Analysis</h4>
                    <p className="text-white/40 text-sm mb-6 max-w-[200px]">Get instance decision support based on your health and location.</p>
                    <button
                        onClick={getAdvice}
                        disabled={loading}
                        className="w-full py-4 bg-primary text-black font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3 group"
                    >
                        {loading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                {error ? <span className="text-red-900">{error}</span> : "What Should I Do?"}
                                {!error && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Go Outside? */}
                        <div className={`p-4 rounded-2xl border ${advice.goOutside === 'YES' ? 'bg-primary/10 border-primary/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 font-bold">Go Outside?</div>
                            <div className="flex items-center gap-2">
                                {advice.goOutside === 'YES' ? (
                                    <CheckCircle2 className="text-primary" size={20} />
                                ) : (
                                    <XCircle className="text-red-500" size={20} />
                                )}
                                <span className={`text-xl font-black ${advice.goOutside === 'YES' ? 'text-primary' : 'text-red-500'}`}>{advice.goOutside}</span>
                            </div>
                        </div>

                        {/* Mask Required? */}
                        <div className={`p-4 rounded-2xl border ${advice.maskRequired === 'YES' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-white/5 border-white/10'}`}>
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2 font-bold">Mask Required?</div>
                            <div className="flex items-center gap-2 text-white">
                                <span className={`text-xl font-black ${advice.maskRequired === 'YES' ? 'text-amber-500' : 'text-white'}`}>{advice.maskRequired}</span>
                            </div>
                        </div>
                    </div>

                    {/* Best Time Window */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Clock className="text-primary" size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Suggested Window</div>
                            <div className="text-sm font-bold text-white">{advice.bestTime}</div>
                        </div>
                    </div>

                    {/* Indoor Actions */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Home className="text-primary" size={16} />
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Indoor Protection</span>
                        </div>
                        <div className="space-y-2">
                            {advice.indoorActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                    <span className="text-[11px] text-white/70 font-medium leading-relaxed">{action}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => setAdvice(null)}
                        className="w-full py-2 text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-white transition-colors"
                    >
                        Recalculate Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default DecisionAdvisor;
