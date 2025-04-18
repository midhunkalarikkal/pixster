import { useEffect, useState } from "react";
import Stories from "../components/Stories";
import StoryUploader from "../components/StoryUploader";
import { usePostStore } from "../store/usePostStore.js";
import { useHomeStore } from "../store/useHomeStore.js";
import Suggestions from "../components/sidebars/Suggestions";
import FeedSkeleton from "../components/skeletons/FeedSkeleton";
import HomePostsScroller from "../components/HomePostsScroller";
import CommentContainer from "../components/CommentContainer.jsx";

const HomePage = () => {
  const [homePostsData, setHomePostsData] = useState([]);

  const { commentUploaderOpen } = usePostStore();
  const {
    storyUploaderOpen,
    getHomePostScrollerData,
    homeScrollerDataLoading,
  } = useHomeStore();

  const fetchPostsData = async () => {
    const posts = await getHomePostScrollerData();
    setHomePostsData(posts);
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  return (
    <>
      <div className="md:w-11/12 lg:w-10/12 flex relative h-[88%] md:h-full mt-14 md:mt-0">
        <div className="w-full md:w-8/12 lg:w-8/12 xl:w-8/12 flex flex-col items-center overflow-y-auto no-scrollbar md:space-y-4">
          <div className="w-full lg:w-10/12 xl:w-10/12 h-32 my-1 md:my-2">
            <Stories />
          </div>
          {homeScrollerDataLoading ? (
            <>
              <FeedSkeleton />
              <FeedSkeleton />
              <FeedSkeleton />
            </>
          ) : homePostsData && homePostsData.length > 0 ? (
            homePostsData.map((post) => (
              <HomePostsScroller key={post?.userPostDetails?._id} post={post} />
            ))
          ) : (
            <>
              <FeedSkeleton />
              <FeedSkeleton />
              <FeedSkeleton />
            </>
          )}
        </div>
        <Suggestions />
      </div>
      {storyUploaderOpen && <StoryUploader />}
      {commentUploaderOpen && <CommentContainer />}
    </>
  );
};

export default HomePage;
