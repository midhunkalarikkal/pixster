import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useProfileStore = create((set) => ({
  requestedProfiles: null,
  requestedProfilesLoading: false,

  incomingrequestedProfiles: null,
  incomingrequestedProfilesLoading: false,

  followingProfiles: null,
  followingProfilesLoading: false,

  followersProfiles: null,
  followersProfilesLoading: false,

  postUploading: false,

  listPage: false,

  setRequestedProfiles: (profiles) => set({ requestedProfiles: profiles }),

  setListPage: (data) => set({ listPage: data }),

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

  getIncomingRequestedProfiles: async () => {
    console.log("incoming request")
    set({ incomingrequestedProfilesLoading: true });
    try {
      const res = await axiosInstance.get("/user/fetchIncomingRequestedProfiles");
      set({ incomingrequestedProfiles: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ incomingrequestedProfilesLoading: false });
    }
  },

  getFollowingsProfiles: async (userId) => {
    set({ followingProfilesLoading: true });
    try {
      const res = await axiosInstance.get(`/user/fetchFollowingProfiles/${userId}`);
      set({ followingProfiles: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ followingProfilesLoading: false });
    }
  },

  getFollowersProfiles: async (userId) => {
    set({ followersProfilesLoading: true });
    try {
      const res = await axiosInstance.get(`/user/fetchFollowersProfiles/${userId}`);
      set({ followersProfiles: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ followersProfilesLoading: false });
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
