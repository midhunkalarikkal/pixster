import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { FileText, UserPlus, Users } from "lucide-react";
import { useSearchStore } from "../store/useSearchStore.js";
import { useProfileStore } from "../store/useProfileStore.js";
import NotificationBar from "../components/NotificationBar.jsx";
import PostsSkeleton from "../components/skeletons/PostsSkeleton.jsx";
import UserBarSkeleton from "../components/skeletons/UserBarSkeleton.jsx";

const ProfilePage = () => {
  let [reqdProfiles, setReqProfiles] = useState([]);
  const [tab, setTab] = useState(0);

  const { authUser } = useAuthStore();
  const {
    getRequestedProfiles,
    requestedProfilesLoading,
    getSearchSelectedUser,
    requestedProfiles,
    getNotifications,
    notifications,
    notificationsLoading,
  } = useProfileStore();

  const { sendConnectionRequest } = useSearchStore();

  console.log("notifications : ", notifications);

  useEffect(() => {
    setReqProfiles(requestedProfiles);
  }, [requestedProfiles]);

  const handleCancelRequest = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    sendConnectionRequest(id, "cancelled")
      .then((data) => {
        if (data) {
          const updatedProfiles = requestedProfiles.filter(
            (user) => user._id !== data._id
          );
          setReqProfiles(updatedProfiles);
        }
      })
      .catch(() => {
        toast.error("Request cancellation failed.");
      });
  };

  const handleViewUser = () => {};

  const handleAcceptRequest = () => {};

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-4">
        <div className="rounded-xl p-6 space-y-8 border border-base-300">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Your Talkzy Profile</h1>
            <p className="mt-2">{authUser?.userName}</p>
          </div>

          <div className="flex flex-col lg:flex-row justify-around">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={authUser.profilePic || "/user_avatar.jpg"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
              </div>
            </div>

            <div className="flex justify-center items-center gap-8 p-6">
              <div className="flex flex-col items-center">
                <FileText className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">{authUser?.postsCount}</p>
                <p className="text-sm text-zinc-400">Posts</p>
              </div>

              <div className="flex flex-col items-center">
                <Users className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">
                  {authUser?.followersCount}
                </p>
                <p className="text-sm text-zinc-400">Followers</p>
              </div>

              <div className="flex flex-col items-center">
                <UserPlus className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">
                  {authUser?.followingCount}
                </p>
                <p className="text-sm text-zinc-400">Following</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 px-6">
            <div>
              <h2 className="text-2xl font-semibold">{authUser?.fullName}</h2>
              <p className="text-zinc-400 text-sm mt-1">{authUser?.about}</p>
            </div>
          </div>

          <div className="flex justify-around p-2 md:p-4 text-center border border-base-300">
            <button
              className="flex flex-col items-center"
              onClick={() => setTab(0)}
            >
              <span className="text-sm text-zinc-400">Posts</span>
            </button>
            <button
              className="flex flex-col items-center"
              onClick={() => setTab(1)}
            >
              <span className="text-sm text-zinc-400">Followers</span>
            </button>
            <button
              className="flex flex-col items-center"
              onClick={() => setTab(2)}
            >
              <span className="text-sm text-zinc-400">Following</span>
            </button>
            <button
              className="flex flex-col items-center"
              onClick={() => {
                setTab(3);
                getRequestedProfiles();
              }}
            >
              <span className="text-sm text-zinc-400">Requested</span>
            </button>
            <button
              className="flex flex-col items-center"
              onClick={() => {
                setTab(4);
                getNotifications();
              }}
            >
              <span className="text-sm text-zinc-400">Notifications</span>
            </button>
          </div>

          {/* Tab 0 */}
          {tab === 0 && (
            <div className="flex justify-center w-full py-2 md:py-4">
              <PostsSkeleton />
            </div>
          )}

          {/* Tab 3 */}
          {tab === 3 &&
            (requestedProfilesLoading ? (
              <div className="flex justify-center w-full py-4">
                <UserBarSkeleton />
              </div>
            ) : reqdProfiles && reqdProfiles.length > 0 ? (
              <div className="flex flex-col justify-center items-center w-full py-4">
                {reqdProfiles.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => getSearchSelectedUser(user._id)}
                    className={`w-full md:w-8/12 p-2 flex gap-3 items-center
                    hover:bg-base-300 transition-colors border-b border-base-300`}
                  >
                    <div className="relative w-2/12">
                      <img
                        src={user.profilePic || "/user_avatar.jpg"}
                        alt={user.name}
                        className="size-10 object-cover rounded-full"
                      />
                    </div>

                    <div className="w-10/12 flex justify-between">
                      <div>
                        <div className="flex justify-between">
                          <p className="font-medium truncate">
                            {user.fullName}
                          </p>
                        </div>
                        <div className="text-sm flex">
                          <p className="font-normal truncate text-stone-500">
                            {user.userName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <a
                          className="px-2 py-1 border border-blue-500 text-white rounded-lg hover:bg-blue-600"
                          onClick={(e) => handleCancelRequest(user._id, e)}
                        >
                          Requested
                        </a>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              tab === 3 && (
                <div className="flex justify-center w-full py-4">
                  <p>{"You haven't sent any connection requests yet."}</p>
                </div>
              )
            ))}

          {tab === 4 &&
            (notificationsLoading ? (
              <div className="flex justify-center w-full py-4">
                <UserBarSkeleton />
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="flex flex-col justify-center items-center w-full py-4">
                {notifications.map((notification) => (
                  <NotificationBar
                    key={notification._id}
                    user={notification.fromUserId}
                    message={notification.message}
                    onClick={(id, e) => handleViewUser(id, e)}
                    onAcceptRequest={(id, e) => handleAcceptRequest(id, e)}
                    isHaveButton={notification.isHaveButton}
                    buttonText={notification.buttonText}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center w-full py-4">
                <p>No notifications yet.</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
