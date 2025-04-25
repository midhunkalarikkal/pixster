import { toast } from "react-toastify";
import { validateCaption } from "./validator";

export const handlePostSubmit = async (
  event,
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
) => {
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

  export const handleCaptionChange = (event, setCaption, setCaptionError) => {
    setCaption(event.target.value);
    const error = validateCaption(event.target.value);
    setCaptionError(error);
  };

  export const handleImageChange = (e, setImagePreview, setImage) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1048576) {
      toast.info("File size must be less than 1mb.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setImage(file);
  };
