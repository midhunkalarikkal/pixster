import PostGrid from "./PostGrid";
import PropTypes from "prop-types";
import ThreadGrid from "./ThreadGrid";
import { memo, useEffect, useState } from "react";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { useProfileStore } from "../../store/useProfileStore";
import ThreadsSkeleton from "../skeletons/ThreadsSkeleton";

const ProfileSecondData = ({ authUserId, userDataId, status, updatepostCount, accountType }) => {

  const [tab, setTab] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [userPostsLoading, setUserPostsLoading] = useState(false);
  const [userSavedPosts, setUserSavedPosts] = useState([]);
  const [userSavedPostsLoading, setUserSavedPostsLoading] = useState(false);
  const [userThreads, setUserThreads] = useState([]);
  const [userThreadsLoading, setUserThreadsLoading] = useState(false);

  const { getUserPosts, getUserSavedPosts, getUserThreads } = useProfileStore();
  const isOwnProfile = authUserId === userDataId;

  console.log("status : ",status);

  useEffect(() => {
    const fetchData = async () => {
      setUserPosts([]);
      setUserSavedPosts([]);
  
      if (authUserId === userDataId) {
        setUserPostsLoading(true);
        const posts = await getUserPosts({ userId: authUserId });
        setUserPosts(posts);
        setUserPostsLoading(false);
  
        setUserSavedPostsLoading(true);
        const savedPosts = await getUserSavedPosts();
        setUserSavedPosts(savedPosts);
        setUserSavedPostsLoading(false);

        setUserThreadsLoading(true);
        const threads = await getUserThreads({ userId : authUserId });
        setUserThreads(threads);
        setUserThreadsLoading(false);
      } else if (status === "accepted" || accountType) {
        console.log("fetching posts");
        console.log("authUserId : ",authUserId);
        console.log("userDataId : ",userDataId);
        setUserPostsLoading(true);
        const posts = await getUserPosts({ userId: userDataId });
        console.log("posts : ",posts);
        setUserPosts(posts);
        setUserPostsLoading(false);
      }
    };
  
    fetchData();
  }, [authUserId, userDataId, status]);

  const handlePostDelete = (id) => {
    setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
    updatepostCount()
  };

  const handleThreadDelete = (id) => {
    setUserThreads((prevThreads) => prevThreads.filter((thread) => thread._id !== id));
    updatepostCount()
  }

  const handleRemoveFromSaved = (id) => {
    setUserSavedPosts((prevSavedPost) =>
      prevSavedPost.filter((post) => post._id !== id)
    );
  };

  return (
    <>
      {authUserId !== userDataId ? (
        (status === "accepted" || accountType) ? (
          <div className="border-t-[1px] border-base-300 flex justify-center">
            <div className="flex justify-around w-8/12 mt-4">
              <button
                className={`flex flex-col items-center w-full ${
                  tab !== 0 && "text-zinc-400"
                }`}
                onClick={() => setTab(0)}
              >
                <span className="text-xs md:text-sm">POSTS</span>
              </button>
              <button
                className={`flex flex-col items-center w-full ${
                  tab !== 5 && "text-zinc-400"
                }`}
                onClick={() => setTab(5)}
              >
                <span className="text-xs md:text-sm">THREADS</span>
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
              <span className="text-xs md:text-sm">POSTS</span>
            </button>
            <button
              className={`flex flex-col items-center w-full ${
                tab !== 5 && "text-zinc-400"
              }`}
              onClick={() => setTab(5)}
            >
              <span className="text-xs md:text-sm">THREADS</span>
            </button>
            <button
              className={`flex flex-col items-center w-full ${
                tab !== 1 && "text-zinc-400"
              }`}
              onClick={() => setTab(1)}
            >
              <span className="text-xs md:text-sm">SAVED</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full py-1 md:py-4">
        {tab === 0 &&
          (isOwnProfile || status === "accepted" || accountType ? (
            userPostsLoading ? (
              <PostsSkeleton />
            ) : userPosts.length > 0 ? (
              <PostGrid
                posts={userPosts}
                authUserId={authUserId}
                userDataId={userDataId}
                onDelete={isOwnProfile ? handlePostDelete : undefined}
                saved={false}
              />
            ) : (
              <p>
                {isOwnProfile
                  ? "You haven't uploaded any post yet."
                  : "This user hasn't uploaded any posts yet."}
              </p>
            )
          ) : null)}

        {tab === 5 &&
          (isOwnProfile || status === "accepted" || accountType ? (
            userThreadsLoading ? (
              <ThreadsSkeleton />
            ) : userThreads && userThreads.length > 0 ? (
              <ThreadGrid
                threads={userThreads}
                authUserId={authUserId}
                userDataId={userDataId}
                onDelete={isOwnProfile ? handleThreadDelete : undefined}
              />
            ) : (
              <p>
                {isOwnProfile
                  ? "You haven't uploaded any thread yet."
                  : "This user hasn't uploaded any threads yet."}
              </p>
            )
          ) : null)}

        {tab === 1 &&
          isOwnProfile &&
          (userSavedPostsLoading ? (
            <PostsSkeleton />
          ) : userSavedPosts.length > 0 ? (
            <PostGrid
              posts={userSavedPosts}
              onRemove={handleRemoveFromSaved}
              saved={true}
            />
          ) : (
            <p>{"You haven't saved any post yet."}</p>
          ))}
      </div>
    </>
  );
};

ProfileSecondData.propTypes = {
  authUserId: PropTypes.string.isRequired,
  userDataId: PropTypes.string.isRequired,
  status: PropTypes.string,
  updatepostCount: PropTypes.func,
  accountType: PropTypes.bool,
};

export default memo(ProfileSecondData);
