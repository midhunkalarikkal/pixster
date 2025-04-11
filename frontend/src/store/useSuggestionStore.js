import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useSuggestionStore = create((set) => ({

    suggestions: null,
    suggestionsLoading: false,

    fetchSuggestions: async () => {
        set({ suggestionsLoading: true });
        try{
            const res = await axiosInstance.get('/user/getSuggestions');
            console.log("response : ",res);
            set({ suggestions : res.data.suggestions });
        }catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ suggestionsLoading: false});
        }
    },

}))