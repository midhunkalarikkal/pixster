import { Plus } from "lucide-react";
import StorySkeleton from "./skeletons/StorySkeleton";

const Stories = () => {
  const openStoryUploader = () => {
    
  };

  return (
    <div className="overflow-x-scroll no-scrollbar">
      <div className="flex space-x-3 items-center px-4 py-8 w-max">
        <div className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block">
          <button
            className="flex justify-center items-center h-20 w-20 rounded-full bg-base-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openStoryUploader();
            }}
          >
            <Plus />
          </button>
        </div>
        {Array.from({ length: 15 }).map((_, index) => (
          <StorySkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default Stories;
