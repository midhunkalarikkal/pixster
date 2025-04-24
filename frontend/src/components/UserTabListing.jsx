import UserTab from "./UserTab";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ListMessage from "./profile/ListMessage";
import { memo, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";
import UserBarSkeleton from "./skeletons/UserBarSkeleton";
import { useProfileStore } from "../store/useProfileStore";

const UserTabListing = ({ authUserId, userDataId, updateFollowersCount, updateFollowingsCount }) => {
  
  const navigate = useNavigate();
  let [reqdProfiles, setReqProfiles] = useState([]);

  const { socket } = useAuthStore();
  const { setListPage, listPage } = useProfileStore();
  const { getSearchSelectedUser, cancelConnectionRequest, removeConnection, unFollowConnectionRequest } = useSearchStore();
  const {
    requestedProfiles,
    setRequestedProfiles,
    requestedProfilesLoading,
    incomingrequestedProfiles,
    setIncomingRequestedProfiles,
    incomingrequestedProfilesLoading,
    followingProfiles,
    setFollowingProfiles,
    followingProfilesLoading,
    followersProfiles,
    setFollowersProfiles,
    followersProfilesLoading,
    tab,
    setTab,
  } = useProfileStore();


  useEffect(() => {
    if (!requestedProfiles) return;
    setReqProfiles(requestedProfiles);
  }, [requestedProfiles]);

  useEffect(() => {
    const handlePushIncomingRequestedProfile = (data) => {
      const updatedProfilesList = [
        ...(incomingrequestedProfiles || []),
        data.userData,
      ];
      setIncomingRequestedProfiles(updatedProfilesList);
    }

    const handlePopIncomingRequestedProfile = (data) => {
      const updatedProfileList = incomingrequestedProfiles.filter(
        (profile) => profile._id !== data.fromUserId
      );

      setIncomingRequestedProfiles(updatedProfileList);
    }

    const handlePopRequestedProfile = (data) => {
      if (requestedProfiles) {
        const updatedRequestedProfiles = requestedProfiles.filter(
          (profile) => profile._id !== data.fromUserId
        );
        setRequestedProfiles(updatedRequestedProfiles);
      }
    }

    const handlePopProfileFromFollowings = (data) => {
      if(followingProfiles) {
        const updatedFollowingProfiles = followingProfiles.filter(
          (profile) => profile._id !== data.userId
        );
        setFollowingProfiles(updatedFollowingProfiles);
        updateFollowingsCount();
      }
    }

    socket?.on("followRequest", handlePushIncomingRequestedProfile);
    socket?.on("requestCancel", handlePopIncomingRequestedProfile);
    socket?.on("requestAccepted",handlePopRequestedProfile);
    socket?.on("removeConnection", handlePopProfileFromFollowings);
    return () => { 
      socket?.off("followRequest", handlePushIncomingRequestedProfile);
      socket?.off("requestCancel", handlePopIncomingRequestedProfile); 
      socket?.off("requestAccepted", handlePopRequestedProfile);
      socket?.off("removeConnection", handlePopProfileFromFollowings)
    }
  },[socket, incomingrequestedProfiles, setIncomingRequestedProfiles, setRequestedProfiles, requestedProfiles, setFollowingProfiles, followingProfiles]);

  const handleCancelRequest = (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelConnectionRequest(user._id, "cancelled", true)
      .then((data) => {
        if (data) {
          const updatedProfiles = requestedProfiles.filter(
            (user) => user._id !== data
          );
          setReqProfiles(updatedProfiles);
        }
      })
      .catch(() => {
        toast.error("Request cancellation failed.");
      });
  };

  const handleUnfollowConnection = async (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!user) {
      toast.error("Something went wrong, please try again");
      return;
    }
    const userId = await unFollowConnectionRequest(user._id, "unfollowed", true)
    if(userId) {
      const updatedFollowingsProfiles = followingProfiles.filter(
        (profile) => profile._id !== userId
      )
      setFollowingProfiles(updatedFollowingsProfiles);
      updateFollowingsCount();
    }
  };

  const handleRemoveConnection = async (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    if(!user) {
      toast.error("Something went wrong please try again");
      return;
    }
    const userId = await removeConnection(user?._id, "removed");
    if(userId) {
      const updatedFollowersProfiles = followersProfiles.filter((profile) => 
        profile._id !== userId
      );
      setFollowersProfiles(updatedFollowersProfiles);
      updateFollowersCount();
    }
  }

  const handleUserTabClick = async (userId) => {
    await getSearchSelectedUser(userId);
    setTab(0);
    setListPage(false);
    navigate('/profile');
  };


  return (
    <div
      className={`h-screen w-full bg-black/90 flex justify-center items-center ${
        listPage && "absolute"
      }`}
    >
      <div className="w-full max-w-md h-[60%] md:h-[550px] rounded-2xl shadow-lg border border-base-300 p-4 flex flex-col bg-base-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">
            {
              {
                2: "Followers",
                3: "Followings",
                4: "Request By You",
                5: "Incoming Request",
              }[tab]
            }
          </h2>
          <button
            onClick={() => {
              setListPage(false);
              setTab(0);
            }}
            className="p-2 rounded-full transition"
          >
            <X className="size-5 md:size-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 transition-all duration-500">
          {tab === 2 &&
            (followersProfilesLoading ? (
              <UserBarSkeleton />
            ) : followersProfiles && followersProfiles.length > 0 ? (
              followersProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  authUserId={authUserId}
                  user={user}
                  buttonText="Remove"
                  showButton={authUserId === userDataId}
                  onButtonClick={handleRemoveConnection}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
             <ListMessage authUserId={authUserId} userDataId={userDataId} tabNum={0} />
            ))}

          {tab === 3 &&
            (followingProfilesLoading ? (
              <UserBarSkeleton />
            ) : followingProfiles && followingProfiles.length > 0 ? (
              followingProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  authUserId={authUserId}
                  user={user}
                  buttonText="Unfollow"
                  showButton={authUserId === userDataId}
                  onButtonClick={handleUnfollowConnection}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
                <ListMessage authUserId={authUserId} userDataId={userDataId} tabNum={1} />
            ))}

          {tab === 4 &&
            (requestedProfilesLoading ? (
              <UserBarSkeleton />
            ) : reqdProfiles && reqdProfiles.length > 0 ? (
              reqdProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  authUserId={authUserId}
                  user={user}
                  buttonText="Cancel"
                  showButton={authUserId === userDataId}
                  onButtonClick={handleCancelRequest}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
                <ListMessage tabNum={2} />
            ))}

          {tab === 5 && (incomingrequestedProfilesLoading ? (
              <UserBarSkeleton />
            ) : incomingrequestedProfiles && incomingrequestedProfiles.length > 0 ? (
                incomingrequestedProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  authUserId={authUserId}
                  user={user}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
                <ListMessage tabNum={3} />
            ))}
        </div>
      </div>
    </div>
  );
};

UserTabListing.propTypes = {
  authUserId: PropTypes.string.isRequired,
  userDataId: PropTypes.string.isRequired,
  updateFollowersCount: PropTypes.func,
  updateFollowingsCount: PropTypes.func,
};

export default memo(UserTabListing);
