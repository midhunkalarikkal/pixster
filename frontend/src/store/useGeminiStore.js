import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useGeminiStore = create(persist((set, get) => ({
    geminiCaptions : [],
    requestCount : 0,
    lastRequestTime: null,

    setGeminiCaptions: (captions) => set({ geminiCaptions : captions }),

    resetRequestCount: () => set({ requestCount : 0 }),

    incrementRequestCount: () =>
        set((state) => ({ requestCount: state.requestCount + 1 })),

      setLastRequestTime: (time) => set({ lastRequestTime: time }),

      canGenerate: () => {
        const now = Date.now();
        const last = get().lastRequestTime;
        return !last || now - last >= 180000;
      },
}),

{
      name: "gemini-store",
      partialize: (state) => ({
        geminiCaptions : state.geminiCaptions,
        requestCount : state.requestCount,
      }),
      storage: createJSONStorage(() => localStorage),
    }
))