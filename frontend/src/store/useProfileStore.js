import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useProfileStore = create((set) => ({

  tab: 0,

  revConnection: null,

  requestedProfiles: null,
  requestedProfilesLoading: false,

  incomingrequestedProfiles: null,
  incomingrequestedProfilesLoading: false,

  followingProfiles: null,
  followingProfilesLoading: false,

  followersProfiles: null,
  followersProfilesLoading: false,

  postUploading: false,
  postForUpdating: null,

  listPage: false,

  homeScrollerDataLoading: false,

  setTab: (data) => set({ tab : data }),

  setRevConnection: (data) => set({ revConnection : data }),

  setListPage: (data) => set({ listPage: data }),

  setPostForUpdating: (post) => set({ postForUpdating : post }),

  setRequestedProfiles: (profiles) => set({ requestedProfiles: profiles }),

  setIncomingRequestedProfiles: (profiles) => set({ incomingrequestedProfiles: profiles }),

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
      const res = await axiosInstance.post('/post/uploadPost', data);
      return res;
    }catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({ postUploading :  false });
    }
  },

  deletePost: async (postId) => {
    try{
      const res = await axiosInstance.delete(`/post/deletePost/${postId}`);
      // returning for accessing it in the postGrid compoenent
      return res;
    }catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updatePost: async (postId, data) => {
    set({ postUploading : true });
    try{
      const res = await axiosInstance.post(`/post/updatePost/${postId}`, data);
      return res;
    }catch (error) {
      toast.error(error.response.data.message);
      return { data: { success: false } };
    }finally {
      set({ postUploading :  false });
    }
  },

  getHomePostScrollerData: async () => {
    set({ homeScrollerDataLoading :  true });
    try{
      const res = await axiosInstance.get('/user/getHomseSrollerData');
      return res.data.posts;
    }catch (error) {
      toast.error(error.response.data.message);
    }finally {
      set({ homeScrollerDataLoading : false });
    }
  }


}));
