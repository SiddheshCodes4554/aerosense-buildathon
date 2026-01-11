import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Mail,
    Lock,
    LogIn,
    UserPlus,
    Chrome,
    UserCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AuthModal = ({ isOpen, onClose }) => {
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

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass w-full max-w-md p-8 rounded-3xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic mb-2">
                            {isLogin ? 'Welcome Back' : 'Join EcoSense'}<span className="text-primary">AI</span>
                        </h2>
                        <p className="text-white/40 text-sm font-mono uppercase tracking-widest">
                            {isLogin ? 'Access your air intelligence' : 'Start your atmospheric journey'}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                        >
                            <AlertCircle size={18} className="shrink-0" />
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
                        <span className="relative px-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em] bg-[#0c0c0c]">
                            Or continue with email
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
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
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isLogin ? (
                                <>
                                    <LogIn size={20} />
                                    Login
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Create Account
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
                                <>Don't have an account? <span className="text-primary font-bold">Sign up</span></>
                            ) : (
                                <>Already have an account? <span className="text-primary font-bold">Log in</span></>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
