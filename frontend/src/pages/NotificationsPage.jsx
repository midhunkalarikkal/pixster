import { useEffect } from "react";
import { useSearchStore } from "../store/useSearchStore";
import NotificationBar from "../components/NotificationBar";
import Suggestions from "../components/sidebars/Suggestions";
import { useNotificationStore } from "../store/useNotificationStores";

const NotificationsPage = () => {
  
  const { getSearchSelectedUser } = useSearchStore();
  const { notifications, notificationsLoading, getNotifications } = useNotificationStore();

  const handleViewUser = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    getSearchSelectedUser(id);
  };

  useEffect(() => {
    getNotifications();
  }, []);


  return (
    <div className="w-[84%] flex">
        <div className={`w-[70%]`}>
          {notificationsLoading ? (
            <div className="flex justify-center items-center w-full px-4 py-8 h-screen">
              <span className="loading loading-bars loading-lg"></span>
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-full px-4 py-8">
              {notifications.map((notification) => (
                <NotificationBar
                  key={notification._id}
                  user={notification.fromUserId}
                  message={notification.message}
                  onClick={(id, e) => handleViewUser(id, e)}
                  time={notification.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center w-full py-4 h-full items-center">
              <p>No notifications yet.</p>
            </div>
          )}
        </div>
      <Suggestions />
    </div>
  );
};

export default NotificationsPage;
