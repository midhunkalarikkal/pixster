import PostGrid from "./PostGrid";
import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { useSearchStore } from "../../store/useSearchStore";

const ProfileSecondData = ({ authUserId, userDataId, status }) => {
  console.log("profileSecondData");
  console.log("authUserId : ", authUserId);
  console.log("userDataId : ", userDataId);
  console.log("status : ", status);

  const [tab, setTab] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [userSavedPosts, setUserSavedPosts] = useState([]);

  const { searchSelectedUser } = useSearchStore();

  useEffect(() => {
    if (!searchSelectedUser) return;
    setUserPosts(searchSelectedUser.userPosts);
    setUserSavedPosts(searchSelectedUser?.userSavedPosts);
  }, [searchSelectedUser]);

  const handlePostDelete = (id) => {
    setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
  };

  const handleRemoveFromSaved = (id) => {
    setUserSavedPosts((prevSavedPost) =>
      prevSavedPost.filter((post) => post._id !== id)
    );
  };

  return (
    <>
      {authUserId !== userDataId ? (
        status === "accepted" ? (
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
      <div className="flex flex-col justify-center items-center w-full py-4">
        {authUserId !== userDataId ? (
          status === "accepted" ? (
            <>
              {tab === 0 &&
                (searchSelectedUser ? (
                  userPosts && userPosts.length > 0 ? (
                    <PostGrid
                      posts={userPosts}
                      authUserId={authUserId}
                      userDataId={userDataId}
                    />
                  ) : (
                    <p>
                      {authUserId === userDataId
                        ? "You haven't uploaded any post yet."
                        : "Not uploaded any post yet."}
                    </p>
                  )
                ) : (
                  <PostsSkeleton />
                ))}
            </>
          ) : null
        ) : (
          <>
            {tab === 0 &&
              (searchSelectedUser ? (
                userPosts && userPosts.length > 0 ? (
                  <PostGrid
                    posts={userPosts}
                    onDelete={handlePostDelete}
                    saved={false}
                  />
                ) : (
                  <p>{"You haven't uploaded any post yet."}</p>
                )
              ) : (
                <PostsSkeleton />
              ))}
            {tab === 1 &&
              (searchSelectedUser ? (
                userSavedPosts && userSavedPosts.length > 0 ? (
                  <PostGrid
                    posts={userSavedPosts}
                    onRemove={handleRemoveFromSaved}
                    saved={true}
                  />
                ) : (
                  <p>{"You haven't uploaded any post yet."}</p>
                )
              ) : (
                <PostsSkeleton />
              ))}
          </>
        )}
      </div>
    </>
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
