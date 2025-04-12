import { useEffect, useState } from "react";
import { useProfileStore } from "../store/useProfileStore";
import Suggestions from "../components/sidebars/Suggestions";
import FeedSkeleton from "../components/skeletons/FeedSkeleton";
import HomePostsScroller from "../components/HomePostsScroller";
import StorySkeleton from "../components/skeletons/StorySkeleton";

const HomePage = () => {

  const [homePostsData, setHomePostsData] = useState([]);
  const { getHomePostScrollerData } = useProfileStore();

  const fetchPostsData = async () => {
    const posts = await getHomePostScrollerData();
    setHomePostsData(posts);
  }

  useEffect(() => {
    fetchPostsData();
  }, []);

  return (
    <div className="w-10/12 flex">
      <div className="w-8/12 flex flex-col items-center overflow-y-auto no-scrollbar space-y-4">
        <StorySkeleton />
        {homePostsData && homePostsData.length > 0 ? (
          homePostsData.map((post) => (
            <HomePostsScroller 
              key={post?.userPostDetails?._id} 
              post={post} 
            />
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
  );
};

export default HomePage;
