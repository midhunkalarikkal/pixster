import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import {
  Camera,
  FileText,
  Mail,
  Text,
  User,
  UserPlus,
  Users,
} from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

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
                  src={
                    selectedImage || authUser.profilePic || "/user_avatar.jpg"
                  }
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`hidden
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400 hidden">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
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

          <div className="flex justify-around p-4 text-center">
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

          <div className="space-y-6 hidden">
            <div className="flex space-x-4">
              <div className="space-y-1.5 w-1/2">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.fullName}
                </p>
              </div>
              <div className="space-y-1.5 w-1/2">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                  {authUser?.userName}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Text className="w-4 h-4" />
                About
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.about}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6 hidden">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
