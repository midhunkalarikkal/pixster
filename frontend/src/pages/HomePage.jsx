import Suggestions from "../components/sidebars/Suggestions";
import FeedSkeleton from "../components/skeletons/FeedSkeleton";
import StorySkeleton from "../components/skeletons/StorySkeleton";

const HomePage = () => {
  return (
    <div className="w-[84%] flex">
      <div className="w-[70%] flex flex-col items-center overflow-y-auto no-scrollbar">
        <StorySkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
        <FeedSkeleton />
      </div>
      <Suggestions />
    </div>
  );
};

export default HomePage;
