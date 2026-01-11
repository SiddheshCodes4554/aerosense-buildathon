import { create } from 'zustand';
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInAnonymously
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

export const useAuthStore = create((set) => ({
    user: null,
    loading: true,
    error: null,

    setUser: (user) => set({ user, loading: false }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false }),

    signup: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    googleLogin: async () => {
        set({ loading: true, error: null });
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    anonymousLogin: async () => {
        set({ loading: true, error: null });
        try {
            await signInAnonymously(auth);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut(auth);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    initAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            set({ user, loading: false });
        });
        return unsubscribe;
    },
}));
