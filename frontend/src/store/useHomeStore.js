import { create } from "zustand";

export const useHomeStore = create((set) => ({
    storyUploaderOpen: false,
    storyUploading: false,

    setStoryUploaderOpen: (data) => set({ storyUploaderOpen : data }),
}))