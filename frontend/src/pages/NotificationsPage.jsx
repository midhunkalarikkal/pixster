
const NotificationsPage = () => {
  return (
    <div>NotificationsPage</div>
  )
}

export default NotificationsPage


{/* <button
              className="flex flex-col items-center"
              onClick={() => {
                setTab(4);
                getNotifications();
              }}
              >
              <span className="text-sm text-zinc-400">Notifications</span>
            </button> */}

            // {tab === 4 &&
            //     (notificationsLoading ? (
            //       <div className="flex justify-center w-full py-4">
            //         <UserBarSkeleton />
            //       </div>
            //     ) : notifications && notifications.length > 0 ? (
            //       <div className="flex flex-col justify-center items-center w-full py-4">
            //         {notifications.map((notification) => (
            //           <NotificationBar
            //             key={notification._id}
            //             user={notification.fromUserId}
            //             message={notification.message}
            //             onClick={(id, e) => handleViewUser(id, e)}
            //             time={notification.createdAt}
            //           />
            //         ))}
            //       </div>
            //     ) : (
            //       <div className="flex justify-center w-full py-4">
            //         <p>No notifications yet.</p>
            //       </div>
            //     ))}