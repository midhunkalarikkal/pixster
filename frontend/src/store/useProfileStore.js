import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useProfileStore = create((set) => ({
  requestedProfiles: null,
  requestedProfilesLoading: false,

  followingProfiles: null,
  followingProfilesLoading: false,

  postUploading: false,

  setRequestedProfiles: (profiles) => set({ requestedProfiles: profiles }),

  getRequestedProfiles: async () => {
    set({ requestedProfilesLoading: true });
    try {
      const res = await axiosInstance.get("/user/fetchRequestedProfiles");
      set({ requestedProfiles: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ requestedProfilesLoading: false });
    }
  },

  getFollowingsProfiles: async () => {
    set({ followingProfilesLoading: true });
    try {
      const res = await axiosInstance.get("/user/fetchFollowingProfiles");
      console.log("following profile : ",res);
      set({ followingProfiles: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ followingProfilesLoading: false });
    }
  },

  uploadPost: async (data) => {
    set({ postUploading : true });
    try{
      console.log("data : ",data);
      const res = await axiosInstance.post('/user/uploadPost', data);
      toast.success(res.data.message);
      return res;
    }catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({ postUploading :  false });
    }
  }


}));
