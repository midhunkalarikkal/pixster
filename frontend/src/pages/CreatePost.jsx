import { toast } from "react-toastify";
import { ImagePlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateCaption } from "../utils/validator";
import { useProfileStore } from "../store/useProfileStore";
import Gemini from "../components/Gemini";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [captionError, setCaptionError] = useState(null);
  const [isPost, setIsPost] = useState(true);
  // const navigate = useNavigate();

  const { uploadPost, postForUpdating, updatePost, setPostForUpdating } =
    useProfileStore();

  useEffect(() => {
    if (postForUpdating) {
      setCaption(postForUpdating.content);
      setImagePreview(postForUpdating.media);
      setIsPost(!!postForUpdating.media);
    }
  }, [postForUpdating]);

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
    const error = validateCaption(event.target.value);
    setCaptionError(error);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      toast.info("File size must be less than 1mb.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setImage(file);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    const error = validateCaption(caption);
    setCaptionError(error);
    if (error) return;

    if (isPost) {
      if (!postForUpdating && !image) {
        toast.info("Please select an image.");
        return;
      }
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("type", isPost ? "Post" : "Thread");

    if (isPost && image) {
      formData.append("postImage", image);
    }

    try {
      let response;
      if (postForUpdating) {
        response = await updatePost(postForUpdating._id, formData);
      } else {
        response = await uploadPost(formData);
      }

      if (response?.data?.success) {
        toast.success(response.data.message);
        setCaption("");
        setImage(null);
        setImagePreview("");
        setCaptionError(null);
        setPostForUpdating(null);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to submit post.");
    } finally {
      setUploading(false);
    }
  };

  

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
    <div className="md:w-11/12 lg:w-10/12 flex justify-center px-4 py-8 h-full overflow-y-scroll no-scrollbar">
      <div className="p-6 rounded-lg shadow-md w-full lg:w-8/12">
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
        <form onSubmit={handlePostSubmit} className="space-y-4">
          {/* Image Upload Field */}
          <div className={`form-control ${!isPost && "hidden"}`}>
            <label className="label">
              <span className="label-text">Upload Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full file-input-sm md:file-input-md"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-h-48 rounded-md object-cover"
                />
              </div>
            )}
          </div>

          {/* Caption Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Caption</span>
            </label>
            <textarea
              className={`textarea textarea-bordered h-24 max-h-96 ${
                captionError ? "textarea-error" : ""
              }`}
              placeholder="Write your caption here, not more than 500 characters"
              value={caption}
              onChange={handleCaptionChange}
            ></textarea>
            {captionError && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {captionError}
                </span>
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col md:flex-row">
            <button
              type="submit"
              className={`btn btn-neutral w-full btn-sm lg:btn-md ${
                postForUpdating ? "md:w-1/2" : "md:w-full"
              }`}
            >
              <ImagePlus className="mr-2" size={20} />
              {postForUpdating ? `Update ${postForUpdating.type}` : "Post"}
            </button>
            {postForUpdating && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setPostForUpdating(null);
                  setCaption("");
                  setImagePreview("");
                }}
                className={`btn btn-error w-full md:w-1/2 btn-sm lg:btn-md mt-2 md:mt-0 md:ml-2`}
              >
                <X className="mr-2" size={20} />
                Discard updating
              </button>
            )}
          </div>
        </form>
        <Gemini />
      </div>
    </div>
  );
};

export default CreatePost;
