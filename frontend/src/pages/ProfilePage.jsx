import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import CustomButton from "../components/CustomButton.jsx";
import UserStat from "../components/profile/UserStat.jsx";
import { useSearchStore } from "../store/useSearchStore.js";
import { useProfileStore } from "../store/useProfileStore.js";
import UserTabListing from "../components/UserTabListing.jsx";
import { AlignJustify, Image, UserPlus, Users } from "lucide-react";
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
    getIncomingRequestedProfiles, 
    getFollowingsProfiles, 
    getFollowersProfiles, 
    setListPage, 
    listPage 
  } = useProfileStore();

  const {
    selectedUserId,
    searchSelectedUser,

    getSearchSelectedUser,
    searchSelectedUserLoading,

    connectionStatusLoading,
    sendConnectionRequest,
    cancelConnectionRequest,
    unFollowConnectionRequest,
  } = useSearchStore();

  useEffect(() => {
    if (searchSelectedUser) {
      setUserData(searchSelectedUser.userData);
      setConnectionData(searchSelectedUser.connectionData);
      setRevConnectionData(searchSelectedUser.revConnectionData);
    }
  }, [searchSelectedUser]);

  useEffect(() => {
    if (!searchSelectedUser && selectedUserId) {
      getSearchSelectedUser(selectedUserId);
    }
  }, [searchSelectedUser, selectedUserId, getSearchSelectedUser]);

  if (searchSelectedUserLoading) {
    return (
      <div className="w-[70%] mx-auto flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  // console.log("authUser : ", authUser);
  // console.log("userData : ", userData);
  // console.log("searchSelectedUser : ",searchSelectedUser);
  console.log("connetionData : ", searchSelectedUser?.connectionData);
  console.log("revConnectionData : ", searchSelectedUser?.revConnectionData);

  return (
    <>
      <div className={`h-screen w-10/12 px-4 py-8 overflow-y-scroll no-scrollbar bg-base-100 ${
          listPage && "relative"
        }`}
      >
        <div className="max-w-4xl mx-auto p-2 md:p-4">
          <div className={`flex justify-end ${authUser?._id !== userData?._id && 'hidden'}`}>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="m-1 rounded-lg">
                <AlignJustify />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm z-10 transition-all duration-300 transform opacity-0 scale-95 dropdown-open:opacity-100 dropdown-open:scale-100"
              >
                <li>
                  <button className="w-full text-sm font-medium py-2 px-4 rounded-md"
                    onClick={() => {
                      getRequestedProfiles();
                      setListPage(true);
                      setTab(4);
                    }}
                  >
                    Requested Profiles
                  </button>
                </li>
                <li>
                  <button className="w-full text-sm font-medium py-2 px-4 rounded-md"
                    onClick={() => {
                      getIncomingRequestedProfiles();
                      setListPage(true);
                      setTab(5);
                    }}
                  >
                    Incoming Requests
                  </button>
                </li>
              </ul>
            </div>
          </div>

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
                  <h2 className="text-lg font-semibold">
                    {userData?.userName}
                  </h2>
                </div>

                <div className="flex space-x-12">
                  <div className="flex flex-col items-center">
                    <Image className="w-6 h-6 text-zinc-400" />
                    <p className="text-lg font-semibold">
                      {userData?.postsCount}
                    </p>
                    <p className="text-sm text-zinc-400">Posts</p>
                  </div>

                  {authUser?._id !== userData?._id ? (
                    connectionData && connectionData.status === "accepted" ? (
                      <>
                        <UserStat
                          icon={Users}
                          count={userData?.followersCount}
                          label="Followers"
                          onClick={() => {
                            getFollowersProfiles(userData._id);
                            setListPage(true);
                            setTab(2);
                          }}
                        />
                        <UserStat
                          icon={UserPlus}
                          count={userData?.followingsCount}
                          label="Following"
                          onClick={() => {
                            getFollowingsProfiles(userData._id);
                            setListPage(true);
                            setTab(3);
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <UserStat
                          icon={Users}
                          count={userData?.followersCount}
                          label="Followers"
                        />
                        <UserStat
                          icon={UserPlus}
                          count={userData?.followingsCount}
                          label="Following"
                        />
                      </>
                    )
                  ) : (
                    <>
                      <UserStat
                        icon={Users}
                        count={userData?.followersCount}
                        label="Followers"
                        onClick={() => {
                          getFollowersProfiles(authUser._id)
                          setListPage(true);
                          setTab(2);
                        }}
                      />
                      <UserStat
                        icon={UserPlus}
                        count={userData?.followingsCount}
                        label="Following"
                        onClick={() => {
                          getFollowingsProfiles(authUser._id);
                          setListPage(true);
                          setTab(3);
                        }}
                      />
                    </>
                  )}
                </div>

                {/* Fullname and about */}
                <div className="flex flex-col mt-4">
                  <h2 className="text-lg font-semibold">
                    {userData?.fullName}
                  </h2>
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
                      cancelConnectionRequest(userData?._id, "cancelled", false)
                    }
                  />
                ) : (
                  connectionData.status === "accepted" && (
                    <CustomButton
                      text={
                        connectionStatusLoading ? "Unfollowing" : "Following"
                      }
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
                      tab !== 4 && "text-zinc-400"
                    }`}
                    onClick={() => setTab(1)}
                  >
                    <span className="text-sm">SAVED</span>
                  </button>
                </div>
              </div>
            )}

            {userData && (
              <ProfileSecondData
                authUserId={authUser?._id}
                userDataId={userData?._id}
                tab={tab}
                setTab={setTab}
                status={connectionData && connectionData.status}
              />
            )}
          </div>
        </div>
      </div>
      {listPage && (
        <UserTabListing
          authUserId={authUser?._id}
          userDataId={userData?._id}
          tab={tab}
          setTab={setTab}
          status={connectionData && connectionData.status}
        />
      )}
    </>
  );
};

export default ProfilePage;
