import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";
import NotificationBar from "../components/NotificationBar";
import Suggestions from "../components/sidebars/Suggestions";
import { useNotificationStore } from "../store/useNotificationStores";
import { useNotificationsSocketEvent } from "../utils/hooks/useNotificationsSocketEvents";

const NotificationsPage = () => {

  const navigate = useNavigate();
  const { socket } = useAuthStore();
  const { getSearchSelectedUser } = useSearchStore();
  const { notifications, notificationsLoading, getNotifications, setNotifications } = useNotificationStore();

  const handleViewUser = (id) => {
    getSearchSelectedUser(id);
    navigate('/profile');
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useNotificationsSocketEvent(socket, setNotifications);

  return (
    <div className="w-full md:w-11/12 lg:w-10/12 flex h-[88%] md:h-full mt-10 md:mt-0">
      <div className="w-full md:w-8/12 overflow-y-scroll no-scrollbar">
        {notificationsLoading ? (
          <div className="flex justify-center items-center w-full px-4 py-8 h-screen">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        ) : notifications && notifications.length > 0 ? (
          <div className="flex flex-col justify-center items-center w-full px-4 py-8 space-y-2">
            {notifications.map((notification) => (
              <NotificationBar
                key={notification._id}
                user={notification.fromUserId}
                message={notification.message}
                onClick={(id, e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleViewUser(id)
                }}
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
