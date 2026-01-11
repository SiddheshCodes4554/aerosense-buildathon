import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudSun,
    Wind,
    Activity,
    ArrowRight,
    Info,
    Thermometer,
    Droplets,
    Factory,
    Loader2,
    RefreshCw,
    Search
} from 'lucide-react';
import { fetchAtmosphericAnalysis } from '../services/groqService';
import { useUserStore } from '../store/useUserStore';

const AtmosphericAnalysis = ({ aqiData }) => {
    const { locationType } = useUserStore();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const performAnalysis = async () => {
        setLoading(true);
        setError(null);
        try {
            const results = await fetchAtmosphericAnalysis({
                aqi: aqiData.aqi,
                category: aqiData.advice.status,
                pm25: aqiData.pollutants.pm25.value,
                pm10: aqiData.pollutants.pm10.value,
                no2: aqiData.pollutants.no2?.value || 0,
                o3: aqiData.pollutants.o3?.value || 0,
                wind: aqiData.wind.speed,
                humidity: aqiData.weather.humidity || 0,
                temp: aqiData.weather.temp,
                time: aqiData.timestamp,
                locationType
            });
            if (results) {
                setAnalysis(results);
            } else {
                throw new Error("No analysis returned from AI");
            }
        } catch (error) {
            console.error("Atmospheric Analysis Error:", error);
            setError(error.message || "Failed to run simulation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!analysis && aqiData) {
            performAnalysis();
        }
    }, [aqiData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <Loader2 className="text-primary animate-spin mb-4" size={32} />
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] animate-pulse">Running Atmospheric Simulations...</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-12">
                <button
                    onClick={performAnalysis}
                    className="flex flex-col items-center group transition-all"
                >
                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                        <Search className="text-white/20 group-hover:text-primary transition-colors" size={32} />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center">
                        {error ? <span className="text-red-400">{error}</span> : "Start Pattern Analysis"}
                    </span>
                    {error && (
                        <span className="text-[8px] text-white/20 mt-1 uppercase tracking-widest">Click to Retry</span>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <CloudSun className="text-primary" size={24} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl leading-none italic uppercase tracking-tighter text-white">
                            Atmospheric<span className="text-primary not-italic">Analysis</span>
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Deep Learning Intelligence</span>
                            <div className="w-1 h-1 rounded-full bg-primary/40" />
                            <span className="text-[8px] font-mono text-primary uppercase tracking-[0.2em] animate-pulse">Live Reasoning</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={performAnalysis}
                    className="p-2.5 rounded-xl glass border-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all"
                    title="Refresh Simulation"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Summary Box */}
            <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 mb-8 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CloudSun size={120} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <Info size={14} />
                    </div>
                    <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.2em]">Expert Summary</span>
                </div>
                <p className="text-sm font-medium text-white/80 leading-relaxed italic relative z-10">
                    "{analysis?.summary || 'Atmospheric data analysis in progress...'}"
                </p>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                {/* Weather Influence */}
                <div className="p-5 rounded-3xl glass border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Wind size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Weather Influence</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                        {analysis?.weatherInfluence || 'Calculating meteorological impact on air quality...'}
                    </p>
                </div>

                {/* Pattern Detection */}
                <div className="p-5 rounded-3xl glass border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <Activity size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Pattern Detected</span>
                    </div>
                    <div className="mb-2">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest border border-purple-500/20">
                            {analysis?.patternDetected || 'Detecting'}
                        </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                        The current atmosphere shows traits of {(analysis?.patternDetected || 'unknown patterns').toLowerCase()}.
                    </p>
                </div>

                {/* Source Inference */}
                <div className="p-5 rounded-3xl glass border-white/5 bg-white/[0.02] md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Factory size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">Probable Sources</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed">
                        {analysis?.inferredSources || 'Identifying potential molecular sources and emission origins...'}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] text-white/20 font-mono uppercase tracking-widest">Dominant Agent:</span>
                            <span className="text-[10px] font-bold text-primary">{analysis?.dominantPollutant || 'Multiple'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/20">
                            <Thermometer size={14} />
                            <Droplets size={14} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtmosphericAnalysis;
