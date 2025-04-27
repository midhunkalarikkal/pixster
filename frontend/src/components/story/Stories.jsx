import Story from "./Story";
import { Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useHomeStore } from "../../store/useHomeStore";
import StorySkeleton from "../skeletons/StorySkeleton";

const Stories = () => {

  const [ storyHover, setStoryHover ] = useState(false);

  const { setStoryUploaderOpen, setMyStory, myStory, usersStories, getStories, deleteMyStory, userStoriesLoading } =
    useHomeStore();

  useEffect(() => {
    getStories();
  }, []);

  const openStoryUploader = () => {
    setStoryUploaderOpen(true);
  };

  const handleMyStoryDelete = async () => {
    const res = await deleteMyStory();
    if(res.success){
      setMyStory(null)
    }
  }

  return (
    <div className="overflow-x-scroll no-scrollbar">
      <div className="flex space-x-2 lg:space-x-3 items-center p-2 md:px-4 md:py-8">
        <div className="flex flex-col justify-center items-center space-y-2">
          <div className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block">
            {myStory ? (
              <div
              className="relative group h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
              onMouseEnter={() => setStoryHover(true)}
              onMouseLeave={() => setStoryHover(false)}
            >
              <img
                src={myStory.img || '/noImg.png'}
                className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full object-cover"
              />
              {storyHover && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleMyStoryDelete();
                    }}
                    className="p-2 hover:scale-110 transition"
                  >
                    <Trash className="text-red-500 w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            ) : (
              <button
                className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 flex justify-center items-center rounded-full bg-base-100"
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
        {userStoriesLoading  ? (
          Array.from({ length: 15 }).map((_, index) => (
            <StorySkeleton key={index} />
          ))
        ) : usersStories && usersStories.length > 0 ?(
           usersStories.map((story) => (
              <Story 
                key={story.userId}
                image={story.img}
                userName={story.userName}
              />
            ))
        ) : null }
      </div>
    </div>
  );
};

export default Stories;
