import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "react-toastify";
import { validateCaption } from "../utils/validator";
import { useProfileStore } from "../store/useProfileStore";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [captionError, setCaptionError] = useState(null);

  const { uploadPost, postForUpdating, updatePost, setPostForUpdating } = useProfileStore();

  useEffect(() => {
    if (postForUpdating) {
      setCaption(postForUpdating.content);
      setImagePreview(postForUpdating.media);
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

    if(file.size > 1048576) {
      toast.info("File size must be less than 1mb.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateCaption(caption);
    setCaptionError(error);
    if (error) return;

    if (!postForUpdating && !image) {
      toast.info("Please select an image.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    if(image) formData.append("postImage", image);
    formData.append("caption", caption);

    try {
      let response;
      if (postForUpdating) {
        response = await updatePost(postForUpdating._id, formData);
      } else {
        response = await uploadPost(formData);
      }

      if (response?.data?.success) {
        toast.success(postForUpdating ? "Post updated!" : "Post created!");
        setCaption("");
        setImage(null);
        setImagePreview("");
        setCaptionError(null);
        setPostForUpdating(null);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Post error:", error);
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
          Post {postForUpdating ? "updating" : "uploading"}, please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="w-10/12 flex justify-center px-4 py-8 h-screen">
      <div className="p-6 rounded-lg shadow-md w-8/12">
        <h2 className="text-xl font-semibold mb-4">
          {postForUpdating ? "Update Post" : "Create New Post"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Upload Image</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
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
              placeholder="Write your caption here, not more than 200 characters"
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
          <button type="submit" className={`btn btn-neutral w-full`}>
            <ImagePlus className="mr-2" size={20} />
            {postForUpdating ? "Update Post" : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
