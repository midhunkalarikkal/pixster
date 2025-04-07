import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { FileText, UserPlus, Users } from "lucide-react";
import { useSearchStore } from "../store/useSearchStore.js";
import { useProfileStore } from "../store/useProfileStore.js";
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
  } = useProfileStore();

  const { cancelConnectionRequest } = useSearchStore();

  useEffect(() => {
    setReqProfiles(requestedProfiles);
  }, [requestedProfiles]);

  const handleCancelRequest = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelConnectionRequest(id, "cancelled")
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

  return (
    <div className="min-h-screen w-full px-4 py-8 overflow-y-scroll no-scrollbar bg-base-100">
      <div className="max-w-5xl mx-auto p-2 md:p-4">
        <div className="space-y-8">

          <div className="flex items-center">

            <div className="relative w-4/12 flex justify-center">
              <img
                src={authUser.profilePic || "/user_avatar.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>

            <div className="flex flex-col w-8/12 justify-center">
            
              <div className="flex flex-col my-4">
                <h2 className="text-lg font-semibold">{authUser?.userName}</h2>
              </div>

              <div className="flex space-x-12">
                <div className="flex flex-col items-center">
                  <FileText className="w-6 h-6 text-zinc-400" />
                  <p className="text-lg font-semibold">
                    {authUser?.postsCount}
                  </p>
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

              <div className="flex flex-col mt-4">
                <h2 className="text-lg font-semibold">{authUser?.fullName}</h2>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2 w-8/12">{authUser?.about}</p>
              </div>
            </div>
          </div>

          <div className="border-t-[1px] border-base-300 flex justify-center">
            <div className="flex justify-around w-8/12">
              <button
                className={`flex flex-col items-center w-full`}
                onClick={() => setTab(0)}
                >
                <span className="text-sm">Posts</span>
              </button>
              <button
                className={`flex flex-col items-center w-full`}
                onClick={() => setTab(1)}
                >
                <span className="text-sm text-zinc-400">Followers</span>
              </button>
              <button
                className={`flex flex-col items-center w-full`}
                onClick={() => setTab(2)}
                >
                <span className="text-sm text-zinc-400">Following</span>
              </button>
              <button
                className={`flex flex-col items-center w-full`}
                onClick={() => {
                  setTab(3);
                  getRequestedProfiles();
                }}
                >
                <span className="text-sm text-zinc-400">Requested</span>
              </button>
              <button
                className={`flex flex-col items-center w-full`}
                onClick={() => {
                  setTab(4);
                }}
                >
                <span className="text-sm text-zinc-400">Saved</span>
              </button>
            </div>
          </div>

          {/* Tab 0 */}
          {tab === 0 && (
            <div className="w-full">
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

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
