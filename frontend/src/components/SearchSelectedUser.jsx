import { useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";
import PostsSkeleton from "./skeletons/PostsSkeleton";
import { FileText, UserPlus, Users } from "lucide-react";
import CustomButton from "./CustomButton";

const SearchSelectedUser = () => {
  const { searchSelectedUser, searchSelectedUserLoading } = useSearchStore();
  const [userData, setUserData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);

  useEffect(() => {
    if (!searchSelectedUser) return;
    setUserData(searchSelectedUser.userData);
    setConnectionData(searchSelectedUser.connectionData);
  }, [searchSelectedUser]);

  return (
    <div className="max-w-3xl mx-auto p-4 py-4 overflow-y-scroll no-scrollbar">
      {!searchSelectedUser ? (
        <p>Animation</p>
      ) : searchSelectedUserLoading ? (
        <div className="rounded-xl p-6 space-y-8 border border-base-300">
          <div className="flex justify-center flex-col items-center">
            <h1 className="text-2xl font-semibold ">Talkzy Profile</h1>
            <p className="mt-2 skeleton h-4 w-20"></p>
          </div>

          <div className="flex flex-col lg:flex-row justify-around">
            <div className="flex flex-col items-center gap-4">
              <div className="skeleton h-32 w-32 shrink-0 rounded-full"></div>
            </div>

            <div className="flex justify-center items-center gap-8 p-6">
              <div className="flex flex-col items-center">
                <FileText className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">0</p>
                <p className="text-sm text-zinc-400">Posts</p>
              </div>

              <div className="flex flex-col items-center">
                <Users className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">0</p>
                <p className="text-sm text-zinc-400">Followers</p>
              </div>

              <div className="flex flex-col items-center">
                <UserPlus className="w-6 h-6 text-zinc-400" />
                <p className="text-lg font-semibold">0</p>
                <p className="text-sm text-zinc-400">Following</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 px-6">
            <div>
              <h2 className="text-2xl font-semibold skeleton h-4 w-36"></h2>
              <p className="text-zinc-400 text-sm mt-1 skeleton h-4 w-56"></p>
            </div>
          </div>

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

          <div className="flex justify-center w-full py-2 md:py-4">
            <PostsSkeleton />
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto p-4 py-4">
          <div className="rounded-xl p-6 space-y-8 border border-base-300">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Your Talkzy Profile</h1>
              <p className="mt-2">{userData?.userName}</p>
            </div>

            <div className="flex flex-col lg:flex-row justify-around">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={userData?.profilePic || "/user_avatar.jpg"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 "
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-8 p-6">
                <div className="flex flex-col items-center">
                  <FileText className="w-6 h-6 text-zinc-400" />
                  <p className="text-lg font-semibold">
                    {userData?.postsCount}
                  </p>
                  <p className="text-sm text-zinc-400">Posts</p>
                </div>

                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 text-zinc-400" />
                  <p className="text-lg font-semibold">
                    {userData?.followersCount}
                  </p>
                  <p className="text-sm text-zinc-400">Followers</p>
                </div>

                <div className="flex flex-col items-center">
                  <UserPlus className="w-6 h-6 text-zinc-400" />
                  <p className="text-lg font-semibold">
                    {userData?.followingCount}
                  </p>
                  <p className="text-sm text-zinc-400">Following</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 px-6">
              <div>
                <h2 className="text-2xl font-semibold">{userData?.fullName}</h2>
                <p className="text-zinc-400 text-sm mt-1">{userData?.about}</p>
              </div>
            </div>

            <div className="w-full flex justify-center">
              {connectionData === null ? (
                // <button className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                //   Follow
                // </button>
                <CustomButton text="Follow" />
              ) : connectionData === "requested" ? (
                <button className="w-full py-2 bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed">
                  Requested
                </button>
              ) : connectionData === "accepted" ? (
                <button className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">
                  Following
                </button>
              ) : (
                connectionData === "rejected" && (
                  <button className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                    Follow
                  </button>
                )
              )}
            </div>

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

            <div className="flex justify-center w-full py-2 md:py-4">
              <PostsSkeleton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelectedUser;
