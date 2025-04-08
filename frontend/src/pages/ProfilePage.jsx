import { useEffect, useState } from "react";
import { Image, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import CustomButton from "../components/CustomButton.jsx";
import { useSearchStore } from "../store/useSearchStore.js";
import { useProfileStore } from "../store/useProfileStore.js";
import ProfileSecondData from "../components/profile/ProfileSecondData.jsx";
import ProfileAcceptReject from "../components/profile/ProfileAcceptReject.jsx";

const ProfilePage = () => {

  const [tab, setTab] = useState(0);

  const [userData, setUserData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [revConnectionData, setRevConnectionData] = useState(null);

  const { authUser } = useAuthStore();

  const {
    getRequestedProfiles,
    getFollowingsProfiles,
    // followingProfilesLoading,
    // followingProfiles
  } = useProfileStore();

  const {
    selectedUserId,
    getSearchSelectedUser,
    searchSelectedUser,
    searchSelectedUserLoading,
    
    revConnectionData,

    connectionStatusLoading,
    sendConnectionRequest,
    cancelConnectionRequest,
    unFollowConnectionRequest,
  } = useSearchStore();


  useEffect(() => {
    if (!searchSelectedUser) return;
    setUserData(searchSelectedUser.userData);
    setConnectionData(searchSelectedUser.connectionData);
    setRevConnectionData(searchSelectedUser.revConnection);
  }, [searchSelectedUser]);

  useEffect(() => {
    if (!userData || !searchSelectedUser) {
      getSearchSelectedUser(selectedUserId);
    }
  }, []);

  if (searchSelectedUserLoading) {
    return (
      <div className="w-[70%] mx-auto flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  console.log("authUser : ", authUser);
  console.log("userData : ", userData);
  console.log("connetionData : ", connectionData);
  console.log("searchSelectedUser : ",searchSelectedUser);
  console.log("revConnectionData : ",revConnectionData);

  return (
    <div className="min-h-screen w-full px-4 py-8 overflow-y-scroll no-scrollbar bg-base-100">
      <div className="max-w-4xl mx-auto p-2 md:p-4">
        {/* Profile top follow request accept or reject bar */}
        {revConnectionData && revConnectionData.status === "requested" && (
          <ProfileAcceptReject
            userId={userData?._id}
            userName={userData?.userName}
          />
        )}

        {/* Content */}
        <div className="space-y-8">
          {/* Profile Header With Profile image and other details */}
          <div className="flex items-center">
            {/* Profile image section left */}
            <div className="relative w-4/12 flex justify-center">
              <img
                src={userData?.profilePic || "/user_avatar.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>

            {/* Profile Post, following, followers count, Fullename, about */}
            <div className="flex flex-col w-8/12 justify-center">
              <div className="flex flex-col my-4">
                <h2 className="text-lg font-semibold">{userData?.userName}</h2>
              </div>

              <div className="flex space-x-12">
                <div className="flex flex-col items-center">
                  <Image className="w-6 h-6 text-zinc-400" />
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

              {/* Fullname and about */}
              <div className="flex flex-col mt-4">
                <h2 className="text-lg font-semibold">{userData?.fullName}</h2>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2 w-8/12">
                  {userData?.about}
                </p>
              </div>
            </div>
          </div>

          {/* MainButton, follow, cancel, unfollow */}
          {authUser?._id !== userData?._id && (
            <div className={`w-full flex justify-center`}>
              {!connectionData ||
              connectionData === null ||
              connectionData.status === "rejected" ||
              connectionData.status === "unfollowed" ||
              connectionData.status === "cancelled" ? (
                <CustomButton
                  text={connectionStatusLoading ? "Requesting" : "Follow"}
                  onClick={() =>
                    sendConnectionRequest(userData?._id, "requested")
                  }
                />
              ) : connectionData.status === "requested" ? (
                <CustomButton
                  text={
                    connectionStatusLoading ? "Cancelling" : "Cancel Request"
                  }
                  onClick={() =>
                    cancelConnectionRequest(userData?._id, "cancelled")
                  }
                />
              ) : (
                connectionData.status === "accepted" && (
                  <CustomButton
                    text={connectionStatusLoading ? "Unfollowing" : "Following"}
                    onClick={() =>
                      unFollowConnectionRequest(userData?._id, "unfollowed")
                    }
                  />
                )
              )}
            </div>
          )}

          {authUser?._id !== userData?._id ? (
            connectionData && connectionData.status === "accepted" ? (
              <div className="border-t-[1px] border-base-300 flex justify-center">
                <div className="flex justify-around w-8/12 mt-4">
                  <button
                    className={`flex flex-col items-center w-full ${
                      tab !== 0 && "text-zinc-400"
                    }`}
                    onClick={() => setTab(0)}
                  >
                    <span className="text-sm">POSTS</span>
                  </button>
                  <button
                    className={`flex flex-col items-center w-full ${
                      tab !== 1 && "text-zinc-400"
                    }`}
                    onClick={() => setTab(1)}
                  >
                    <span className="text-sm">FOLLOWERS</span>
                  </button>
                  <button
                    className={`flex flex-col items-center w-full ${
                      tab !== 2 && "text-zinc-400"
                    }`}
                    onClick={() => {
                      setTab(2);
                      getFollowingsProfiles();
                    }}
                  >
                    <span className="text-sm">FOLLOWINGS</span>
                  </button>
                </div>
              </div>
            ) : null
          ) : (
            <div className="border-t-[1px] border-base-300 flex justify-center">
              <div className="flex justify-around w-8/12 mt-4">
                <button
                  className={`flex flex-col items-center w-full ${
                    tab !== 0 && "text-zinc-400"
                  }`}
                  onClick={() => setTab(0)}
                >
                  <span className="text-sm">POSTS</span>
                </button>
                <button
                  className={`flex flex-col items-center w-full ${
                    tab !== 1 && "text-zinc-400"
                  }`}
                  onClick={() => setTab(1)}
                >
                  <span className="text-sm">FOLLOWERS</span>
                </button>
                <button
                  className={`flex flex-col items-center w-full ${
                    tab !== 2 && "text-zinc-400"
                  }`}
                  onClick={() => {
                    setTab(2);
                    getFollowingsProfiles();
                  }}
                >
                  <span className="text-sm">FOLLOWINGS</span>
                </button>
                <button
                  className={`flex flex-col items-center w-full ${
                    tab !== 3 && "text-zinc-400"
                  }`}
                  onClick={() => {
                    setTab(3);
                    getRequestedProfiles();
                  }}
                >
                  <span className="text-sm">REQUESTED</span>
                </button>
                <button
                  className={`flex flex-col items-center w-full ${
                    tab !== 4 && "text-zinc-400"
                  }`}
                  onClick={() => {
                    setTab(4);
                  }}
                >
                  <span className="text-sm">SAVED</span>
                </button>
              </div>
            </div>
          )}

          <ProfileSecondData 
            authUserId={authUser?._id}
            userDataId={userData?._id}
            tab={tab}
            setTab={setTab}
            status={connectionData && connectionData.status}
          />

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
