import PostGrid from "./PostGrid";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { useSearchStore } from "../../store/useSearchStore";

const ProfileSecondData = ({ authUserId, userDataId, tab, status }) => {

  const [userPosts, setUserPosts] = useState([]);

  const { 
    searchSelectedUser, 
  } = useSearchStore();

  useEffect(() => {
    if (!searchSelectedUser) return;
    setUserPosts(searchSelectedUser.userPosts);
  }, [searchSelectedUser]);

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
                <p>{authUserId === userDataId ? "You haven't uploaded any post yet." : "Not uploaded any post yet."}</p>
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
          {tab === 1 && <PostsSkeleton />}
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

export default memo(ProfileSecondData);
