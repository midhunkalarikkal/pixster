import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
    handleCaptionChange,
    handleImageChange,
    handlePostSubmit,
} from "../utils/createPageMethods";
import { ImagePlus, X } from "lucide-react";
import { useProfileStore } from "../store/useProfileStore";

const PostOrThreadCreationForm = (
{
    setUploading,
    isPost,
    setIsPost,
}
) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [captionError, setCaptionError] = useState(null);

  const { uploadPost, postForUpdating, updatePost, setPostForUpdating } =
    useProfileStore();

      useEffect(() => {
        if (postForUpdating) {
          setCaption(postForUpdating.content);
          setImagePreview(postForUpdating.media);
          setIsPost(!!postForUpdating.media);
        }
      }, [postForUpdating]);

  return (
    <form
      onSubmit={(e) =>
        handlePostSubmit(
          e,
          caption,
          setCaptionError,
          isPost,
          postForUpdating,
          image,
          setUploading,
          updatePost,
          uploadPost,
          setCaption,
          setImage,
          setImagePreview,
          setPostForUpdating
        )
      }
      className="space-y-4"
    >
      {/* Image Upload Field */}
      <div className={`form-control ${!isPost && "hidden"}`}>
        <label className="label">
          <span className="label-text">Upload Image</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full file-input-sm md:file-input-md"
          onChange={(e) => handleImageChange(e, setImagePreview, setImage)}
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
          <span className="label-text">{isPost ? "Caption" : "Thread"}</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-24 max-h-96 ${
            captionError ? "textarea-error" : ""
          }`}
          placeholder={isPost ? "Write your caption here, not more than 200 characters" : "Write your thread here"}
          value={caption}
          onChange={(e) => handleCaptionChange(e, setCaption, setCaptionError)}
        ></textarea>
        {captionError && (
          <label className="label">
            <span className="label-text-alt text-error">{captionError}</span>
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
  );
};

PostOrThreadCreationForm.propTypes = {
    setUploading: PropTypes.func,
    isPost: PropTypes.bool,
    setIsPost: PropTypes.func,
}

export default PostOrThreadCreationForm;
