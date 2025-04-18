import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, Text, User } from "lucide-react";
import { toast } from "react-toastify";

const ProfileSettings = () => {
  const { authUser, isUpdatingProfile, updateProfileImage, removeProfileImage } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    setSelectedImage(URL.createObjectURL(file));
    await updateProfileImage(formData);
  };

  const handleRemoveProfileImage = () => {
    if(!authUser.profilePic){
      toast.info("Your profile Image is already removed.");
      return;
    }
    removeProfileImage();
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-base-content/70">
          You can update the profile image from here
        </p>
      </div>

      <div className="mx-auto md:p-4 md:py-4 bg-base-200 rounded-lg shadow-lg border border-base-300">
        <div className="max-w-3xl mx-auto md:p-4">
          <div className="rounded-xl p-2 md:p-6 space-y-8 border border-base-300 bg-base-100">
            <div className="flex flex-col lg:flex-row justify-around">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={
                      selectedImage || authUser.profilePic || "/user_avatar.jpg"
                    }
                    alt="Profile"
                    className="size-24 md:size-32 rounded-full object-cover border-4 "
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`
                          absolute bottom-0 right-0 
                          bg-base-content hover:scale-105
                          p-2 rounded-full cursor-pointer 
                          transition-all duration-200
                          ${
                            isUpdatingProfile
                              ? "animate-pulse pointer-events-none"
                              : ""
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
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="size-4" />
                  Full Name
                </div>
                <input
                  type="text"
                  className="px-4 py-1.5 md:py-2.5 bg-base-200 rounded-lg border w-full text-sm md:text-md"
                  value={authUser?.fullName}
                  readOnly
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="size-4" />
                  User Name
                </div>
                <p className="px-4 py-1.5 md:py-2.5 bg-base-200 rounded-lg border text-sm md:text-md">
                  {authUser?.userName}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="size-4" />
                  Email Address
                </div>
                <p className="px-4 py-1.5 md:py-2.5 bg-base-200 rounded-lg border text-sm md:text-md">
                  {authUser?.email}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Text className="size-4" />
                  About
                </div>
                <input
                  type="text"
                  className="px-4 py-1.5 md:py-2.5 bg-base-200 rounded-lg border w-full text-sm md:text-md"
                  value={authUser?.about}
                  readOnly
                />
              </div>
            </div>

            <div className="rounded-xl p-4">
              <h2 className="text-lg font-medium  mb-4">Account Controls</h2>
              <div className="space-y-3 text-sm">
                <span className="flex items-center justify-between py-1 border-b border-zinc-700"></span>
                <div className="flex items-center justify-between py-2">
                  <span>Remove profile Image</span>
                  <button className="btn btn-sm rounded-lg" onClick={handleRemoveProfileImage}>Remove</button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Off repeating notification</span>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="toggle transition duration-300 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl p-4">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <span className="flex items-center justify-between py-1 border-b border-zinc-700"></span>
                <div className="flex items-center justify-between">
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
    </>
  );
};

export default ProfileSettings;
