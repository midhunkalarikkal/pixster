import CustomButton from "./CustomButton";
import { useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";
import { FileText, Loader, UserPlus, Users } from "lucide-react";

const SearchSelectedUser = () => {
  const {
    searchSelectedUser,
    searchSelectedUserLoading,
    connectionStatusLoading,
    sendConnectionRequest
  } = useSearchStore();

  const [userData, setUserData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  console.log("searchSelectedUser : ",searchSelectedUser);
  console.log("connectionData : ",connectionData);

  useEffect(() => {
    if (!searchSelectedUser) return;
    setUserData(searchSelectedUser.userData);
    setConnectionData(searchSelectedUser.connectionData);
    setUserPosts(searchSelectedUser.userPosts);
  }, [searchSelectedUser]);

  if(searchSelectedUserLoading) {
    return (
      <div className="w-[70%] mx-auto flex justify-center items-center">
        <Loader className="w-10 h-10 animate-spin"/>
      </div>
    )
  }

  return (
    <div className="w-[70%] mx-auto p-4 py-4 overflow-y-scroll no-scrollbar">
      {!searchSelectedUser ? (
        <p>Animation</p>
      ) : (
        <div className="w-full mx-auto p-4 py-4">
          <div className="rounded-xl p-6 space-y-8 border border-base-300 bg-base-100">
            <div className="flex items-center">
              <div className="relative w-4/12 flex justify-center">
                <img
                  src={userData?.profilePic || "/user_avatar.jpg"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
              </div>

              <div className="flex flex-col w-8/12 justify-center">
                <div className="flex flex-col my-4">
                  <h2 className="text-lg font-semibold">{userData?.userName}</h2>
                </div>

                <div className="flex space-x-12">
                  <div className="flex flex-col items-center">
                    <FileText className="w-6 h-6 text-zinc-400" />
                    <p className="text-lg font-semibold">{userData?.postsCount}</p>
                    <p className="text-sm text-zinc-400">Posts</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <Users className="w-6 h-6 text-zinc-400" />
                    <p className="text-lg font-semibold">{userData?.followersCount}</p>
                    <p className="text-sm text-zinc-400">Followers</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <UserPlus className="w-6 h-6 text-zinc-400" />
                    <p className="text-lg font-semibold">{userData?.followingCount}</p>
                    <p className="text-sm text-zinc-400">Following</p>
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <h2 className="text-lg font-semibold">{userData?.fullName}</h2>
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-2 w-8/12">
                    {userData?.about}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center">
              {!connectionData ||
              connectionData === null ||
              connectionData.status === "rejected" ||
              connectionData.status === "cancelled" ||
              connectionData.status === "unfollowed" ? (
                <CustomButton
                  text={connectionStatusLoading ? "Requesting" : "Follow"}
                  onClick={() =>
                    sendConnectionRequest(userData?._id, "requested")
                  }
                />
              ) : connectionData.status === "requested" ? (
                <CustomButton
                  text={connectionStatusLoading ? "Cancelling" : "Requested"}
                  // onClick={}
                />
              ) : (
                connectionData.status === "accepted" && (
                  <CustomButton
                    text={connectionStatusLoading ? "Unfollowing" : "Following"}
                    // onClick={}
                  />
                )
              )}
            </div>

            {connectionData === "Following" && (
              <div className="flex justify-center w-full py-2 md:py-4">
                <div className="flex justify-around p-2 md:p-4 text-center border border-base-300">
                  <button className="flex flex-col items-center">
                    <span className="text-sm text-zinc-400">Posts</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-sm text-zinc-400">Followers</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <span className="text-sm text-zinc-400">Following</span>
                  </button>
                </div>

                {userPosts && userPosts.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 p-2 gap-2">
                    {userPosts.map((post) => (
                      <img
                        key={post._id}
                        src={post.media}
                        className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 lg:h-36 lg:w-36 rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <div>no posts yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelectedUser;
