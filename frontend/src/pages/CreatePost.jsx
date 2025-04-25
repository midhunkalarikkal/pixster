import { useState } from "react";
import Gemini from "../components/Gemini";
import { useProfileStore } from "../store/useProfileStore";
import PostOrThreadCreationForm from "../components/PostOrThreadCreationForm";

const CreatePost = () => {

  const [isPost, setIsPost] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { postForUpdating } =useProfileStore();

  if (uploading) {
    return (
      <div className="w-10/12 flex flex-col justify-center items-center px-4 py-8 h-screen">
        <span className="loading loading-bars loading-lg"></span>
        <p className="font-semibold">
          {postForUpdating && postForUpdating.type}{" "}
          {postForUpdating ? "updating" : "uploading"}, please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="md:w-11/12 lg:w-10/12 flex justify-center px-4 py-8 min-h-full overflow-y-scroll no-scrollbar">
      <div className="p-6 rounded-lg w-full lg:w-8/12">
        <h2 className="flex flex-col text-lg md:text-xl font-semibold mb-4">
          {postForUpdating
            ? `Update ${postForUpdating && postForUpdating.type}`
            : `Create New ${isPost ? "Post" : "Thread"}`}
          <input
            type="checkbox"
            checked={!isPost}
            onChange={() => setIsPost((prev) => !prev)}
            className={`toggle toggle-md rounded-md mt-4 transition duration-300 ${
              postForUpdating && "hidden"
            }`}
          />
        </h2>
        {!uploading && !postForUpdating && (
          <p className="text-sm">
            You can post only the caption and it will be treated as a thread
          </p>
        )}
        <PostOrThreadCreationForm setUploading={setUploading} isPost={isPost} setIsPost={setIsPost}/>
        <Gemini isPost={isPost} setIsPost={setIsPost}/>
      </div>
    </div>
  );
};

export default CreatePost;
