import UserTab from "../UserTab";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import UserBarSkeleton from "../skeletons/UserBarSkeleton";
import { useSearchStore } from "../../store/useSearchStore";
import { useProfileStore } from "../../store/useProfileStore";

const ProfileSecondData = ({ authUserId, userDataId, tab, setTab, status }) => {
  let [reqdProfiles, setReqProfiles] = useState([]);

  const { 
    getSearchSelectedUser,
    cancelConnectionRequest,
 } = useSearchStore();

  const {
    requestedProfilesLoading,
    requestedProfiles,
  } = useProfileStore();

    useEffect(() => {
      setReqProfiles(requestedProfiles);
    }, [requestedProfiles]);

  const handleCancelRequest = (user, e) => {
    e.preventDefault();
    e.stopPropagation();
    cancelConnectionRequest(user._id, "cancelled")
      .then((data) => {
        if (data) {
          const updatedProfiles = requestedProfiles.filter(
            (user) => user._id !== data._id
          );
          setReqProfiles(updatedProfiles);
        }
      })
      .catch(() => {
        toast.error("Request cancellation failed.");
      });
  };

  const handleUserTabClick = (userId) => {
    getSearchSelectedUser(userId);
    setTab(0);
  };

  return (
    <div className="flex flex-col justify-center items-center w-full py-4">
      {authUserId !== userDataId ? (
        status === "accepted" ? (
          <>
            {tab === 0 && <PostsSkeleton />}
            {tab === 1 && <UserBarSkeleton />}
            {tab === 2 && <UserBarSkeleton />}
          </>
        ) : null
      ) : (
        <>
          {tab === 0 && <PostsSkeleton />}
          {tab === 1 && <UserBarSkeleton />}
          {tab === 2 && <UserBarSkeleton />}
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
