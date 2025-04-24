import { toast } from "react-toastify";
import { create } from "zustand";

export const useThemeStore = create((set) => ({

    theme: localStorage.getItem("chat-theme") || "black",

    setTheme: (theme) => {
      if(theme !== "black") {
        toast.info("We recommend balck theme for good user experience.");
      }
      localStorage.setItem("chat-theme", theme);
      set({ theme });
    },
  }));