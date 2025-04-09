import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { persist, createJSONStorage } from 'zustand/middleware';

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
    set({ selectedUserId: userId });
    set({ searchSelectedUserLoading: true });
    try {
      console.log("calling api")
      const res = await axiosInstance.get(`/user/fetchSearchedUserProfile/${userId}`);
      set({ searchSelectedUser: res.data });
      if(navigate) navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ searchSelectedUserLoading: false });
    }
  },

  setSearchSelectedUserNull: () => {
    set({ searchSelectedUser: null });
  },

  setSearchSelectedUserConnectionData: (newConnectionData, newRevConnectionData) => {
    set((state) => ({
      searchSelectedUser: {
        ...state.searchSelectedUser,
        connectionData: newConnectionData,
        revConnectionData: newRevConnectionData,
      },
    }));
  },

  // **** Connection Requests **** //
  sendConnectionRequest: async (toUserId, status) => {
    set({ connectionStatusLoading: true });
    try {
      const res = await axiosInstance.post(
        `/connection/sendConnectionRequest/${toUserId}?status=${status}`
      );
      toast.success(res.data.message);
      set({ searchSelectedUser: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

  acceptConnectionRequest: async (toUserId, status) => {
    set({ acceptRejectLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/acceptConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ acceptRejectLoading: false });
    }
  },

  rejectConnectionRequest: async (toUserId, status) => {
    set({ acceptRejectLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/rejectConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ acceptRejectLoading: false });
    }
  },

  cancelConnectionRequest: async (toUserId, status) => {
    set({ connectionStatusLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/cancelConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

  unFollowConnectionRequest: async (toUserId, status) => {
    set({ connectionStatusLoading: true });
    try {
        const res = await axiosInstance.post(`/connection/unFollowConnectionRequest/${toUserId}?status=${status}`);
        toast.success(res.data.message);
        set({ searchSelectedUser: res.data });
        return res.data.userData;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ connectionStatusLoading: false });
    }
  },

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
