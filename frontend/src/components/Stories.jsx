import Story from "./Story";
import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useHomeStore } from "../store/useHomeStore";
import StorySkeleton from "./skeletons/StorySkeleton";

const Stories = () => {
  const { setStoryUploaderOpen, myStory, usersStories, getStories } =
    useHomeStore();

  useEffect(() => {
    getStories();
  }, []);

  const openStoryUploader = () => {
    setStoryUploaderOpen(true);
  };

  return (
    <div className="overflow-x-scroll no-scrollbar">
      <div className="flex space-x-2 lg:space-x-3 items-center p-2 md:px-4 md:py-8">
        <div className="flex flex-col justify-center items-center space-y-2">
          <div className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block">
            {myStory ? (
              <img
                src={myStory.img || '/noImg.png'}
                className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full object-cover"
              />
            ) : (
              <button
                className="flex justify-center items-center h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full bg-base-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openStoryUploader();
                }}
              >
                <Plus />
              </button>
            )}
          </div>
          <p className="text-xs">My Story</p>
        </div>
        {usersStories && usersStories.length > 0
          ? usersStories.map((story) => (
              <Story 
                key={story._userId}
                image={story.img}
                userName={story.userName}
              />
            ))
          : Array.from({ length: 15 }).map((_, index) => (
              <StorySkeleton key={index} />
            ))}
      </div>
    </div>
  );
};

export default Stories;
