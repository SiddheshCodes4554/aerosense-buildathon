import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
        (set) => ({
            healthProfile: 'Normal', // Normal, Child, Elderly, Asthma
            locationType: 'Urban',   // Urban, Residential, Roadside

            setHealthProfile: (profile) => set({ healthProfile: profile }),
            setLocationType: (type) => set({ locationType: type }),
        }),
        {
            name: 'aerosense-user-storage',
        }
    )
);
