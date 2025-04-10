import UserTab from "../UserTab";
import PostGrid from "./PostGrid";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import UserBarSkeleton from "../skeletons/UserBarSkeleton";
import { useSearchStore } from "../../store/useSearchStore";
import { useProfileStore } from "../../store/useProfileStore";

const ProfileSecondData = ({ authUserId, userDataId, tab, setTab, status }) => {
  let [reqdProfiles, setReqProfiles] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const { 
    searchSelectedUser, 
    getSearchSelectedUser, 
    cancelConnectionRequest, 
  } = useSearchStore();

  const { 
    requestedProfiles, 
    requestedProfilesLoading, 
    
    followingProfiles,
    followingProfilesLoading,
  } = useProfileStore();

  useEffect(() => {
    setReqProfiles(requestedProfiles);
    if (!searchSelectedUser) return;
    setUserPosts(searchSelectedUser.userPosts);
  }, [requestedProfiles, searchSelectedUser]);

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
  }

  const handleUserTabClick = (userId) => {
    getSearchSelectedUser(userId);
    setTab(0);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-4">
      {authUserId !== userDataId ? (
        status === "accepted" ? (
          <>
            {tab === 0 && (
            searchSelectedUser ? (
              userPosts && userPosts.length > 0 ? (
                <PostGrid posts={userPosts} />
              ) : (
                <p>{"You haven't uploaded any post yet."}</p>
              )
            ) : (
              <PostsSkeleton />
            )
          )}
          </>
        ) : null
      ) : (
        <>
          {tab === 0 && (
            searchSelectedUser ? (
              userPosts && userPosts.length > 0 ? (
                <PostGrid posts={userPosts} />
              ) : (
                <p>{"You haven't uploaded any post yet."}</p>
              )
            ) : (
              <PostsSkeleton />
            )
          )}
          {tab === 1 && <UserBarSkeleton />}
          {tab === 2 && 
          (
            followingProfilesLoading ? (
              <UserBarSkeleton />
            ) : followingProfiles && followingProfiles.length > 0 ? (
              followingProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  user={user}
                  buttonText="Unfollow"
                  onButtonClick={handleUnfollowConnection}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
              <p>{"You are not following anyone."}</p>
            )
          )}
          {tab === 3 &&
            (requestedProfilesLoading ? (
              <UserBarSkeleton />
            ) : reqdProfiles && reqdProfiles.length > 0 ? (
              reqdProfiles.map((user) => (
                <UserTab
                  key={user._id}
                  user={user}
                  buttonText="Cancel Requested"
                  onButtonClick={handleCancelRequest}
                  onClickUser={handleUserTabClick}
                />
              ))
            ) : (
              <p>{"You haven't sent any connection requests yet."}</p>
            ))}
          {tab === 4 && <PostsSkeleton />}
        </>
      )}
    </div>
  );
};

ProfileSecondData.propTypes = {
  authUserId: PropTypes.string.isRequired,
  userDataId: PropTypes.string.isRequired,
  tab: PropTypes.number.isRequired,
  setTab: PropTypes.func.isRequired,
  status: PropTypes.string,
};

export default ProfileSecondData;
