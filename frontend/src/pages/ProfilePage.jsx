import { useEffect, useState } from "react";
import { Image, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import UserStat from "../components/profile/UserStat.jsx";
import { useSearchStore } from "../store/useSearchStore.js";
import { useProfileStore } from "../store/useProfileStore.js";
import UserTabListing from "../components/UserTabListing.jsx";
import CustomButton from "../components/Buttons/CustomButton.jsx";
import ProfileSecondData from "../components/profile/ProfileSecondData.jsx";
import ProfileAcceptReject from "../components/profile/ProfileAcceptReject.jsx";
import ProfileHeadDropdown from "../components/profile/ProfileHeadDropdown.jsx";
import { useProfileSocketEvents } from "../utils/hooks/useProfileSocketEvents.js";
import { handlePostDelete, handleRemoveFollowerProfile, handleRemoveFollowingPrfoile } from "../utils/profilePageMethods.js";

const ProfilePage = () => {

  const [userData, setUserData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [revConnectionData, setRevConnectionData] = useState(null);

  const { authUser, socket } = useAuthStore();

  const {
    revConnection,
    setRevConnection,
    getRequestedProfiles,
    getIncomingRequestedProfiles,
    getFollowingsProfiles,
    getFollowersProfiles,
    setListPage,
    listPage,
    setTab,
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
    if (selectedUserId) {
      getSearchSelectedUser(selectedUserId);
    }
  }, [selectedUserId, getSearchSelectedUser]);

  useProfileSocketEvents(socket, userData, setUserData, setRevConnection, setConnectionData);

  if (searchSelectedUserLoading) {
    return (
      <div className="w-[70%] mx-auto flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`h-screen w-full md:w-11/12 lg:10/12 p-2 md:px-4 md:py-8 overflow-y-scroll no-scrollbar bg-base-100 mt-10 md:mt-0 ${
          listPage && "relative"
        }`}
      >
        <div className="max-w-4xl mx-auto p-2 md:p-4">
          <ProfileHeadDropdown
            authUserId={authUser?._id}
            userId={userData?._id}
            getRequestedProfiles={getRequestedProfiles}
            getIncomingRequestedProfiles={getIncomingRequestedProfiles}
            setListPage={setListPage}
          />

          {/* Profile top follow request accept or reject bar */}
          {authUser?._id !== userData?._id &&
            ((revConnection && revConnection.status === "requested") ||
              (revConnectionData &&
                revConnectionData.status === "requested")) && (
              <ProfileAcceptReject
                userId={userData?._id}
                userName={userData?.userName}
              />
            )}

          <div className="space-y-8">
            {/* Profile Header With Profile image and other details */}
           <div>
            <div className="flex">
              <div className="w-4/12 flex justify-center items-center">
                <img
                  src={userData?.profilePic || "/user_avatar.jpg"}
                  alt="Profile"
                  className="size-20 md:size-28 rounded-full object-cover border-2 md:border-4"
                />
              </div>

              {/* Profile Post, following, followers count, Fullename, about */}
              <div className="flex flex-col w-8/12 justify-center">
                <div className="mb-2 md:mb-4">
                  <h2 className="text-md md:text-lg font-semibold">
                    {userData?.fullName}
                  </h2>
                </div>

                <div className="flex space-x-10">
                  <div className="flex flex-col items-center">
                    <Image className="size-5 md:size-6 text-zinc-400" />
                    <p className="text-md md:text-lg font-semibold">
                      {userData?.postsCount}
                    </p>
                    <p className="text-xs md:text-sm text-zinc-400 w-full">
                      My Feed
                    </p>
                  </div>

                  {userData && authUser?._id !== userData?._id ? (
                    connectionData &&
                    (connectionData.status === "accepted" ||
                      connectionData.status === "followed") ? (
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
                    userData && (
                      <>
                        <UserStat
                          icon={Users}
                          count={userData?.followersCount}
                          label="Followers"
                          onClick={() => {
                            getFollowersProfiles(authUser._id);
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
                    )
                  )}
                </div>

              </div>
            </div>

            {/* Fullname and about */}
            <div className="flex w-full justify-center">
              <div className="flex flex-col mt-1 md:mt-4 w-10/12">
                <h2 className="text-sm md:text-lg font-semibold">
                  {userData?.userName}
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm mt-1 line-clamp-2 w-full">
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
                connectionData.status === "cancelled" ||
                connectionData.status === "removed" ? (
                  <CustomButton
                    text={
                      connectionStatusLoading
                        ? userData.public
                          ? "Connecting"
                          : "Requesting"
                        : "Follow"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      sendConnectionRequest(userData?._id, "requested");
                    }}
                  />
                ) : connectionData.status === "requested" ? (
                  <CustomButton
                    text={
                      connectionStatusLoading ? "Cancelling" : "Cancel Request"
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      cancelConnectionRequest(
                        userData?._id,
                        "cancelled",
                        false
                      );
                    }}
                  />
                ) : (
                  (connectionData.status === "accepted" ||
                    connectionData.status === "followed") && (
                    <CustomButton
                      text={
                        connectionStatusLoading ? "Unfollowing" : "Following"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        unFollowConnectionRequest(
                          userData?._id,
                          "unfollowed",
                          false
                        );
                      }}
                    />
                  )
                )}
              </div>
            )}

            {userData && (
              <ProfileSecondData
                authUserId={authUser?._id}
                userDataId={userData?._id}
                status={connectionData && connectionData.status}
                updatepostCount={() => handlePostDelete(setUserData)}
                accountType={userData?.public}
              />
            )}
          </div>
        </div>
      </div>
      {listPage && (
        <UserTabListing
          authUserId={authUser?._id}
          userDataId={userData?._id}
          updateFollowersCount={() => handleRemoveFollowerProfile(setUserData)}
          updateFollowingsCount={() => handleRemoveFollowingPrfoile(setUserData)}
        />
      )}
    </>
  );
};

export default ProfilePage;
