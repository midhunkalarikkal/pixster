import { useEffect } from "react";

export const useProfileSocketEvents  = (socket, userData, setUserData, setRevConnection, setConnectionData) => {
    useEffect(() => {
        const handleRevConnectionShow = (data) => {
          setRevConnection(data.revConnectionData);
          if (data?.isFollowedPublicAccount) {
            setUserData(prev => ({
              ...prev,
              followersCount: prev.followersCount + 1,
            }));
          }
        };
    
        const handleRevConnectionHide = (data) => {
          setRevConnection(data.revConnectionData);
        };
    
        const handleRequestAcceptUpdateData = (data) => {
          setRevConnection(data.revConnectionData);
          setConnectionData(data.connectionData);
          if (!userData) return;
          setUserData(prev => ({
            ...prev,
            followersCount: prev.followersCount + 1,
          }));
        };
    
        const handleUnfollowConnectionUpdateData = () => {
          if (!userData) return;
          setUserData(prev => ({
            ...prev,
            followersCount: prev.followersCount === 0 ? 0 : prev.followersCount - 1,
          }));
        };
    
        const handleRequestRejectUpdateData = (data) => {
          setRevConnection(data.revConnectionData);
          setConnectionData(data.connectionData);
        };
    
        socket?.on("followRequest", handleRevConnectionShow);
        socket?.on("requestCancel", handleRevConnectionHide);
        socket?.on("requestAccepted", handleRequestAcceptUpdateData);
        socket?.on("unfollowConnection", handleUnfollowConnectionUpdateData);
        socket?.on("requestReject", handleRequestRejectUpdateData);
        return () => {
          socket?.off("followRequest", handleRevConnectionShow);
          socket?.off("requestCancel", handleRevConnectionHide);
          socket?.off("requestAccepted", handleRequestAcceptUpdateData);
          socket?.off("unfollowConnection", handleUnfollowConnectionUpdateData);
          socket?.off("requestReject", handleRequestRejectUpdateData);
        };
      }, [socket, setRevConnection, userData, setConnectionData, setUserData]);
}