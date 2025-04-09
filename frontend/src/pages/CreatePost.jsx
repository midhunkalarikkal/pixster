import { useState } from "react";
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

  const { uploadPost } = useProfileStore();

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
    const error = validateCaption(event.target.value);
    setCaptionError(error);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
      setImage(base64Image);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.info("Please select an image.");
      return;
    }

    const error = validateCaption(caption);
    setCaptionError(error);

    if (error) {
      return;
    }

    setUploading(true);
    try {
      console.log("Uploading image:", image);
      console.log("Caption:", caption);

      const uploadResult = await uploadPost({
        postImage: image,
        postCaption: caption,
      });

      if (uploadResult.data.success) {
        setCaption("");
        setImage(null);
        setImagePreview("");
        setCaptionError(null);
      } else {
        toast.error("Post upload error, please try again.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  if (uploading) {
    return (
      <div className="w-full flex flex-col justify-center items-center px-4 py-8 h-screen">
        <span className="loading loading-bars loading-lg"></span>
        <p className="font-semibold">
          Post uploading, please wait, it will take less than a minute
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center px-4 py-8 h-screen">
      <div className="p-6 rounded-lg shadow-md w-8/12">
        <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
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
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
