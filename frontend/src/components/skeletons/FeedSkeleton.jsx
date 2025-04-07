import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";

const FeedSkeleton = () => {
  return (
    <div className="flex flex-col w-7/12">
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-2 items-center">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="flex flex-col space-y-2">
            <div className="skeleton h-3 w-48"></div>
            <div className="skeleton h-2 w-32"></div>
          </div>
        </div>
        <Ellipsis />
      </div>
      <div className="skeleton h-[32rem]"></div>
      <div className="py-2 px-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Heart />
            <MessageCircle />
            <Send />
          </div>
          <Bookmark />
        </div>
        <div className="w-6/12 h-3 skeleton"></div>
        <div className="w-10/12 h-3 skeleton"></div>
      </div>
    </div>
  );
};

export default FeedSkeleton;
