import PostsSkeleton from "../components/skeletons/PostsSkeleton.jsx";
import UserBarSkeleton from "../components/skeletons/UserBarSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { FileText, UserPlus, Users } from "lucide-react";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

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

          <div className="flex justify-center w-full py-4">
            <UserBarSkeleton />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
