import { create } from "zustand";

export const useSearchStore = create((set) => ({
    searchSelectedUser: null,

    setSearchSelectedUser: (userId) => {
        set({ searchSelectedUser: userId });
    }
}))