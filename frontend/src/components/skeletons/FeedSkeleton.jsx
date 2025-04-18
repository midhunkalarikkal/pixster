import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";

const FeedSkeleton = () => {
  return (
    <div className="flex flex-col w-full md:w-7/12 bg-base-100">
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-2 items-center">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="flex flex-col space-y-2">
            <div className="skeleton h-3 w-48"></div>
            <div className="skeleton h-2 w-32"></div>
          </div>
        </div>
        <Ellipsis className="size-6"/>
      </div>
      <div className="skeleton h-[24rem] md:h-[32rem]"></div>
      <div className="py-2 px-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Heart className="size-6"/>
            <MessageCircle className="size-6"/>
            <Send className="size-6"/>
          </div>
          <Bookmark className="size-6"/>
        </div>
        <div className="w-6/12 h-3 skeleton"></div>
        <div className="w-10/12 h-3 skeleton"></div>
      </div>
    </div>
  );
};

export default FeedSkeleton;
