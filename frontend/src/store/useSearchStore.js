import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { persist, createJSONStorage } from 'zustand/middleware';
import { useProfileStore } from "./useProfileStore";

export const useSearchStore = create(persist((set) => ({

  selectedUserId: null,
  searchSelectedUser: null,
  searchSelectedUserLoading: false,

  connectionStatusLoading: false,
  acceptRejectLoading: false,

  searchLoading: false,
  searchedUsers: null,

  getSearchUsers: async (searchQuery) => {
    set({ searchLoading: true });
    try {
      const res = await axiosInstance.get(`/user/searchUsers`, {
        params: { searchQuery },
      });
      set({ searchedUsers: res.data.users });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ searchLoading: false });
    }
  },

  getSearchSelectedUser: async (userId, navigate) => {
    set({ searchSelectedUserLoading: true });
    try {
      const res = await axiosInstance.get(`/user/fetchSearchedUserProfile/${userId}`);
      if(res.status === 200) {
        set({ selectedUserId: userId });
        set({ searchSelectedUser: res.data });
        if(navigate) navigate('/profile');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      set({ searchSelectedUser: null });
    } finally {
      set({ searchSelectedUserLoading: false });
    }
  },

  setSearchSelectedUserNull: () => {
    set({ searchSelectedUser: null });
  },

  fetchMediaGrid: async () => {
    try {
      const res = await axiosInstance.get('/user/getMediaGrid');
      return res.data.mediaPosts;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  

  // Connection calls

  sendConnectionRequest: async (toUserId, status) => {
    set({ connectionStatusLoading: true });
    try {
      const res = await axiosInstance.post(
        `/connection/sendConnectionRequest/${toUserId}?status=${status}`
      );
      toast.success(res.data.message);
      set({ searchSelectedUser: res.data });
      return res;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

  acceptConnectionRequest: async (toUserId, status) => {
    set({ acceptRejectLoading: true });
    const { setRevConnection } = useProfileStore.getState();
    try {
        const res = await axiosInstance.post(`/connection/acceptConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        setRevConnection(null);
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ acceptRejectLoading: false });
    }
  },

  rejectConnectionRequest: async (toUserId, status) => {
    set({ acceptRejectLoading: true });
    const { setRevConnection } = useProfileStore.getState();
    try {
        const res = await axiosInstance.post(`/connection/rejectConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        setRevConnection(null);
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ acceptRejectLoading: false });
    }
  },

  cancelConnectionRequest: async (toUserId, status, fromSelfProfile) => {
    set({ connectionStatusLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/cancelConnectionRequest/${toUserId}?status=${status}`, {fromSelfProfile} );
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        // This is for removing the cancelled reques from the user profile request list 
        // and this is using in the ProfileSecondData.jsx
        return res.data.requestToRemoveId;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

  unFollowConnectionRequest: async (toUserId, status, tab) => {
    set({ connectionStatusLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/unFollowConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        if(!tab) {
          set({ searchSelectedUser: res.data });
        } else {
          return res.data.userData._id;
        }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

  removeConnection: async (fromUserId, status) => {
    try {
      const res = await axiosInstance.post(`/connection/removeConnection/${fromUserId}?status=${status}`);
      toast.success(res.data.message);
      return res.data.userId
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

}),

{
  name: 'search-store',
  partialize: (state) => (
    { 
      selectedUserId: state.selectedUserId,
     }
  ),
  storage: createJSONStorage(() => localStorage),
}
));
