import { X } from "lucide-react";
import { useHomeStore } from "../../store/useHomeStore";
import { FileUpload } from "../ui/file-upload";
import { useState } from "react";
import { toast } from "react-toastify";

const StoryUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    storyUploaderOpen,
    storyUploading,
    setStoryUploaderOpen,
    uploadStory
  } = useHomeStore();

  const handleUpload = async (file) => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("storyImage", file);

    try {
        await uploadStory(formData);
    } catch {
      toast.error("story uploading error");
    } 
  };

  const handleCloseStoryUploader = () => {
    setStoryUploaderOpen(false);
  };

  return (
    <div
      className={`h-screen w-full bg-black/90 flex justify-center items-center ${
        storyUploaderOpen ? "absolute" : "hidden"
      }`}
    >
      <div className="w-11/12 md:w-6/12 lg:w-4/12 h-[600px] rounded-2xl shadow-lg border border-base-300 p-4 flex flex-col bg-base-100">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Upload Your Story</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseStoryUploader();
            }}
            className="p-2 rounded-full transition"
          >
            <X />
          </button>
        </div>
        <div className="flex overflow-y-auto no-scrollbar space-y-3 justify-center items-center h-full">
          {storyUploading ? (
            <div className="flex flex-col justify-center items-center space-y-4">
              <span className="loading loading-bars loading-md"></span>
              <p>Story uploading, please wait</p>
            </div>
          ) : (
            <FileUpload
              onChange={(file) => setSelectedFile(file)}
              onUpload={handleUpload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryUploader;
