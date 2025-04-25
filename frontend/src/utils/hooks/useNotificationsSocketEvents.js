import { useEffect } from "react";

export const useNotificationsSocketEvent = (socket, setNotifications) => {
    
    useEffect(() => {
        const handlePushNewNotification = (data) => {
          setNotifications((prev) => [data.notification, ...prev]);
        }
    
        socket?.on("followRequest", handlePushNewNotification);
        socket?.on("postLikeSocket", handlePushNewNotification);
        socket?.on("commentedOnPost", handlePushNewNotification);
        socket?.on("commentLiked", handlePushNewNotification);
        return () => { 
          socket?.off("followRequest", handlePushNewNotification);
          socket?.off("postLikeSocket", handlePushNewNotification); 
          socket?.off("commentedOnPost", handlePushNewNotification); 
          socket?.off("commentLiked", handlePushNewNotification); 
        }
      }, [socket, setNotifications]);
}