import { useEffect, useState } from "react";
import Stories from "../components/Stories";
import StoryUploader from "../components/StoryUploader";
import { useProfileStore } from "../store/useProfileStore";
import Suggestions from "../components/sidebars/Suggestions";
import FeedSkeleton from "../components/skeletons/FeedSkeleton";
import HomePostsScroller from "../components/HomePostsScroller";
import CommentContainer from "../components/CommentContainer.jsx";
import { usePostStore } from "../store/usePostStore.js";
import { useHomeStore } from "../store/useHomeStore.js";

const HomePage = () => {

  const [homePostsData, setHomePostsData] = useState([]);
  const { getHomePostScrollerData } = useProfileStore();
  const { commentUploaderOpen } = usePostStore();
  const { storyUploaderOpen } = useHomeStore();
  
  const fetchPostsData = async () => {
    const posts = await getHomePostScrollerData();
    setHomePostsData(posts);
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  return (
    <>
    <div className="w-10/12 flex relative">
      <div className="w-8/12 flex flex-col items-center overflow-y-auto no-scrollbar space-y-6">
        <div className="w-8/12 h-32">
          <Stories />
        </div>
        {homePostsData && homePostsData.length > 0 ? (
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
    {storyUploaderOpen && (
      <StoryUploader />
    )}
    {commentUploaderOpen && (
      <CommentContainer />
    )}
    </>
  );
};

export default HomePage;
