import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, ShieldCheck, Zap, Chrome, UserCircle2, Mail, Lock, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AuthGate = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, signup, googleLogin, anonymousLogin, loading, error, setError } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            await login(email, password);
        } else {
            await signup(email, password);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambient Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[128px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-6 overflow-hidden p-2">
                        <img src="/logo.jpg" alt="EcoSense AI Logo" className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white text-center">
                        EcoSense<span className="text-primary not-italic">AI</span>
                    </h1>
                    <p className="text-white/40 text-[10px] font-mono uppercase tracking-[0.3em] mt-2">
                        Authorization Required
                    </p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] relative overflow-hidden">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-white/40 text-sm">
                            {isLogin ? 'Enter your credentials to access the console' : 'Register to start monitoring air quality'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs"
                        >
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button
                            onClick={googleLogin}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl glass glass-hover border-white/5 text-sm font-medium transition-all group"
                        >
                            <Chrome size={18} className="text-white/60 group-hover:text-primary" />
                            Google
                        </button>
                        <button
                            onClick={anonymousLogin}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl glass glass-hover border-white/5 text-sm font-medium transition-all group"
                        >
                            <UserCircle2 size={18} className="text-white/60 group-hover:text-primary" />
                            Guest
                        </button>
                    </div>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <span className="relative px-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] bg-[#0c0c0c]/80 backdrop-blur-md rounded-full">
                            secure email access
                        </span>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isLogin ? (
                                <>
                                    <LogIn size={20} />
                                    Login to System
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Create New Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Login/Signup */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-white/40 text-xs hover:text-white transition-colors"
                        >
                            {isLogin ? (
                                <>Access code not found? <span className="text-primary font-bold">Register here</span></>
                            ) : (
                                <>Existing operative? <span className="text-primary font-bold">Sign in here</span></>
                            )}
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 opacity-20 grayscale">
                    <ShieldCheck size={24} className="text-white" />
                    <Zap size={24} className="text-white" />
                    <Wind size={24} className="text-white" />
                </div>
            </motion.div>
        </div>
    );
};

export default AuthGate;
