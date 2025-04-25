import model from "./gemini";
import { toast } from "react-toastify";
import { validateCaption } from "./validator";
import { formatTimeForClock } from "./helpers";
import { GEMINI_QUERY_END, GEMINI_QUERY_INITAL } from "./constants";

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

  export  const handleGenerateCaptions = (
    e,
    searchText,
    requestCount,
    canGenerate,
    lastRequestTime,
    setGeminiCaptions,
    incrementRequestCount,
    setLastRequestTime,
    startCooldown
) => {
    e.preventDefault();
    const query = searchText.current?.value?.trim();

    if (!query) return toast.info("Please tell me your taste of caption");

    if (requestCount >= 2) return toast.warning("Daily limit reached (2/2)");

    if (!canGenerate()) {
      const wait = Math.floor((lastRequestTime + 180000 - Date.now()) / 1000);
      return toast.info(`Please wait ${formatTimeForClock(wait)} before generating again`);
    }

    const geminiQuery =
      GEMINI_QUERY_INITAL + searchText.current.value + GEMINI_QUERY_END;

      toast.promise(
        (async () => {
          try {
            const result = await model.generateContent(geminiQuery);
            const response = await result.response;
            const text = response?.candidates[0]?.content?.parts[0]?.text;
            const cleanText = text.replace(/```json|```/g, "").trim();
            const captions = JSON.parse(cleanText);
            setGeminiCaptions(captions);
            incrementRequestCount();
            setLastRequestTime(Date.now());
            startCooldown();
          } catch {
            toast.error("Something went wrong. Try again.");
          }
        })(),
        {
          pending: "Generating captions...",
          success: "Captions ready!",
          error: "Failed to generate.",
        }
      );
  };

