import UserTab from "./UserTab";
import { X } from "lucide-react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import ListMessage from "./profile/ListMessage";
import { memo, useEffect, useState } from "react";
import { useSearchStore } from "../store/useSearchStore";
import UserBarSkeleton from "./skeletons/UserBarSkeleton";
import { useProfileStore } from "../store/useProfileStore";

const UserTabListing = ({ authUserId, userDataId, tab, setTab }) => {
  
  let [reqdProfiles, setReqProfiles] = useState([]);

  const { setListPage, listPage } = useProfileStore();
  const { getSearchSelectedUser, cancelConnectionRequest } = useSearchStore();
  const {
    requestedProfiles,
    requestedProfilesLoading,
    incomingrequestedProfiles,
    incomingrequestedProfilesLoading,
    followingProfiles,
    followingProfilesLoading,
    followersProfiles,
    followersProfilesLoading,
  } = useProfileStore();


  useEffect(() => {
    if (!requestedProfiles) return;
    setReqProfiles(requestedProfiles);
  }, [requestedProfiles]);

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

  const handleUnfollowConnection = (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info("working on it");
  };

  const handleUserTabClick = (userId) => {
    getSearchSelectedUser(userId);
    setTab(0);
    setListPage(false);
  };


  return (
    <div
      className={`h-screen w-full bg-black/90 flex justify-center items-center ${
        listPage && "absolute"
      }`}
    >
      <div className="w-full max-w-md h-[500px] rounded-2xl shadow-lg border border-base-300 p-4 flex flex-col bg-base-100">
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
            <X className="w-5 h-5" />
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
                  onButtonClick={handleUnfollowConnection}
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
  tab: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
};

export default memo(UserTabListing);
