import { useEffect } from "react";

export const useNotificationsSocketEvent = (socket, setNotifications, notifications) => {
    
    useEffect(() => {
        const handlePushNewNotification = (data) => {
          const newNotifications = [data.notification, ...notifications];
          setNotifications(newNotifications);
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
      }, [socket, setNotifications, notifications]);
}