import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirQuality } from './hooks/useAirQuality';
import { useLocationStore } from './store/useLocationStore';
import { getCardinalDirection } from './utils/windMath';
import { LocationSearch } from './components/LocationSearch';
import AirQualityMap from './components/AirQualityMap';
import SmartForecast from './components/SmartForecast';
import { classifySource } from './utils/pollutantAnalysis';
import ImpactSection from './components/ImpactSection';
import ExposureCalculator from './components/tools/ExposureCalculator';
import BreathingCoach from './components/tools/BreathingCoach';
import CarbonFootprint from './components/tools/CarbonFootprint';
import SolarEfficiency from './components/solar/SolarEfficiency';
import WelcomeScreen from './components/WelcomeScreen';
import {
  Wind,
  Home,
  Trees,
  Activity,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
  Navigation,
  Loader2,
  Car,
  Factory,
  HardHat,
  Flame,
  Search,
  User,
  LogOut,
  MapPin
} from 'lucide-react';
import { useAuthStore } from './store/useAuthStore';
import AuthModal from './components/AuthModal';
import AuthGate from './components/AuthGate';
import DecisionAdvisor from './components/DecisionAdvisor';
import AtmosphericAnalysis from './components/AtmosphericAnalysis';
import ChemicalFingerprintAI from './components/ChemicalFingerprintAI';
import PersonalHealthGuide from './components/PersonalHealthGuide';
import { useEffect } from 'react';


const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`glass glass-hover p-6 rounded-lg ${className}`}
  >
    {children}
  </motion.div>
);

const AQIGauge = ({ aqi }) => {
  const getColor = (val) => {
    if (val <= 50) return '#10b981'; // Green
    if (val <= 100) return '#f59e0b'; // Yellow (Moderate)
    if (val <= 150) return '#f97316'; // Orange (Sensitive)
    if (val <= 200) return '#ef4444'; // Red (Unhealthy)
    if (val <= 300) return '#7e22ce'; // Purple (Very Unhealthy)
    return '#4c0519'; // Maroon (Hazardous)
  };

  const percentage = Math.min(100, (aqi / 500) * 100);
  const color = getColor(aqi);

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <svg className="w-48 h-48 transform -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="80"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-white/5"
        />
        <motion.circle
          cx="96"
          cy="96"
          r="80"
          stroke={color}
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={502.4}
          initial={{ strokeDashoffset: 502.4 }}
          animate={{ strokeDashoffset: 502.4 - (502.4 * percentage) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={aqi}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-bold tracking-tighter"
        >
          {Math.floor(aqi)}
        </motion.span>
        <span className="text-sm font-medium opacity-60 uppercase tracking-widest">AQI Score</span>
      </div>
    </div>
  );
};

const App = () => {
  const { data, isIndoor, toggleIndoor, error } = useAirQuality();
  const { locationName, isTracking, coordinates } = useLocationStore();
  const { user, loading: authLoading, initAuth, logout } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  // Auth Gate: If checking auth, show loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary animate-spin" size={48} />
          <p className="text-white/40 font-mono animate-pulse uppercase tracking-[0.2em] text-xs">Decrypting Auth State...</p>
        </div>
      </div>
    );
  }

  // Auth Gate: If not logged in, show AuthGate
  if (!user) {
    return <AuthGate />;
  }

  if (!coordinates) return <WelcomeScreen />;

  if (!data) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <>
            <AlertTriangle className="text-red-500" size={48} />
            <p className="text-red-400 font-mono text-center px-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Retry
            </button>
          </>
        ) : (
          <>
            <Loader2 className="text-primary animate-spin" size={48} />
            <p className="text-white/40 font-mono animate-pulse">Synchronizing with Eco-Sensors...</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 font-sans transition-colors duration-700">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-16 pt-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">

          {/* Logo Section */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden p-1">
              <img src="/logo.jpg" alt="EcoSense AI Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
                EcoSense<span className="text-primary not-italic">AI</span>
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em]">Atmospheric Intelligence</span>
                {isTracking && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-bold text-primary animate-pulse uppercase">
                    <div className="w-1 h-1 rounded-full bg-primary shadow-[0_0_5px_#10b981]" />
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Central Search Area */}
          <div className="flex-1 max-w-2xl w-full">
            <LocationSearch />
          </div>

          {/* Action & Info Area */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 sm:gap-4 lg:gap-6">

            {/* Status Pills */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleIndoor}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all duration-300 font-medium text-sm ${isIndoor ? 'bg-primary/10 border-primary/30 text-primary' : 'glass border-white/5 text-white/50 hover:text-white'
                  }`}
              >
                {isIndoor ? <Home size={16} /> : <Trees size={16} />}
                <span>{isIndoor ? 'Indoor' : 'Outdoor'}</span>
              </button>

              <div className="glass px-5 py-2.5 rounded-xl flex items-center gap-3 border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">{data.timestamp}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="hidden xl:block w-px h-8 bg-white/5 mx-2" />

            {/* User Interaction */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mb-0.5">Operative</span>
                    <span className="text-sm font-bold text-white/90">{user.displayName || user.email?.split('@')[0] || 'Guest'}</span>
                  </div>
                  <div className="relative group">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-11 h-11 rounded-[14px] border border-white/10 ring-4 ring-primary/5 group-hover:ring-primary/20 transition-all cursor-pointer" />
                    ) : (
                      <div className="w-11 h-11 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all cursor-pointer">
                        <User size={22} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="p-3 rounded-xl glass glass-hover text-white/20 hover:text-red-400 border-white/5 transition-all group"
                    title="Logout Agent"
                  >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-2.5 px-7 py-3 rounded-xl bg-primary text-black font-black text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <User size={18} />
                  Access Console
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Global Location Indicator (Sub-header) */}
        <div className="mt-8 flex items-center gap-3 px-1">
          <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
            <MapPin size={12} className="text-primary/40" />
            Active Monitoring Zone:
          </div>
          <div className="text-xs font-bold text-white/60 tracking-tight flex items-center gap-2">
            {locationName}
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="text-primary/60 font-mono text-[9px]">{coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <main className="max-w-7xl mx-auto bento-grid">
        {/* Main AQI Gauge Case */}
        <Card className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 flex flex-col items-center justify-center !p-10 border-primary/20 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <Zap className="text-primary/20" size={120} />
          </div>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="flex items-center gap-2 text-white/40 mb-1">
              <Navigation size={12} />
              <span className="text-[10px] font-mono uppercase tracking-widest">{locationName.split(',')[0]}</span>
            </div>
          </div>
          <AQIGauge aqi={data.aqi} />
          <div className={`mt-8 px-6 py-2 rounded-full border border-white/10 ${data.advice.color} bg-white/5 font-bold uppercase tracking-widest text-sm`}>
            {data.advice.status}
          </div>
          <div className="mt-4 text-[10px] font-mono text-white/20 uppercase tracking-[4px]">
            Data Source: {data.sourceName}
          </div>
        </Card>

        {/* Neuro-Forecaster Graph */}
        <Card className="col-span-1 md:col-span-2 row-span-2 border-primary/10">
          <SmartForecast forecastData={data.forecast || []} />
        </Card>

        {/* AI Decision Advisor Case */}
        <Card className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 border-secondary/20 bg-secondary/5">
          <DecisionAdvisor aqiData={data} />
        </Card>

        {/* Pollutant Case */}
        <Card className="col-span-1 md:col-span-2 row-span-2 border-accent/20">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-accent" />
            <h3 className="font-bold text-lg">Pollutant Breakdown</h3>
          </div>
          <div className="space-y-6">
            {Object.entries(data.pollutants).map(([key, p], idx) => (
              <div key={key}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium text-white/60 uppercase">{p.name} {key === 'co' ? '(µ/m³)' : '(ppb)'}</span>
                  <span className="font-mono font-bold">{p.value}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (p.value / p.max) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.1 * idx }}
                    className={`h-full bg-gradient-to-r ${key === 'pm25' ? 'from-red-500/50 to-red-500' :
                      key === 'pm10' ? 'from-orange-500/50 to-orange-500' :
                        'from-accent/50 to-accent'
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pollutant Source Fingerprint */}
        <Card className="col-span-1 md:col-span-2 row-span-2 bg-white/5 border-white/10 !p-8">
          <ChemicalFingerprintAI pollutants={data.pollutants} />
        </Card>

        {/* Map Placeholder Case */}
        <Card className="col-span-1 md:col-span-2 row-span-2 border-white/5 bg-white/5 !p-0 overflow-hidden group">
          <AirQualityMap aqi={data.aqi} wind={data.wind} />
        </Card>

        {/* AI Atmospheric Analysis Case */}
        <Card className="col-span-1 md:col-span-4 border-primary/20 bg-primary/5 !p-10 relative overflow-hidden">
          <AtmosphericAnalysis aqiData={data} />
        </Card>

        {/* Health Tools Section */}
        <div className="col-span-1 md:col-span-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1 border-primary/20 bg-primary/5">
            <ExposureCalculator pm25={data.pollutants.pm25.value} />
          </Card>
          <Card className="col-span-1 border-secondary/20 bg-secondary/5">
            <BreathingCoach aqi={data.aqi} />
          </Card>
          <Card className="col-span-1 border-accent/20 bg-accent/5">
            <CarbonFootprint />
          </Card>
          <Card className="col-span-1 border-amber-500/20 bg-amber-500/5">
            <SolarEfficiency
              weather={data.weather}
              pm25={data.pollutants.pm25}
            />
          </Card>
        </div>

        {/* AI Personal Health Guide Case */}
        <Card className="col-span-1 md:col-span-4 border-red-500/10 bg-red-500/[0.02] !p-10 relative overflow-hidden mt-6">
          <PersonalHealthGuide aqiData={data} isIndoor={isIndoor} />
        </Card>

        {/* Impact Lab Section */}
        <div className="col-span-1 md:col-span-4 mt-6">
          <ImpactSection aqi={data.aqi} pollutants={data.pollutants} />
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="max-w-7xl mx-auto mt-12 flex flex-col md:flex-row justify-between items-center text-white/40 text-[10px] gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="font-mono uppercase">AI CORE: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 tracking-widest">
            <span className="font-mono uppercase opacity-50 italic">Aggregated from {data.sourceName}</span>
          </div>
        </div>
        <div className="font-mono">
          &copy; 2026 ECOSENSE • EPA COMPLIANT DATA ENGINE
        </div>
      </footer>
    </div>
  );
};

export default App;
