import { PlusIcon, X } from "lucide-react";
import { usePostStore } from "../store/usePostStore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comment from "./Comment";

const CommentUploader = () => {
  const {
    commentUploading,
    commentUploaderOpen,
    setCommentUploaderOpen,
    uploadComment,
    setSelectedPostId,
    selectedPostId,
    getComments,
  } = usePostStore();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [addComment, setAddComment] = useState(false);

  const fetchAllComments = async () => {
    const res = await getComments({ postId: selectedPostId });
    setComments(res);
  };

  useEffect(() => {
    if (!selectedPostId) return;
    console.log("Cooment uploader");
    fetchAllComments();
  }, [selectedPostId]);

  const handleCloseCommentUploader = () => {
    setCommentUploaderOpen(false);
    setSelectedPostId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || !selectedPostId) {
      toast.error("Something went wrong, please try again.");
      return;
    }

    const res = await uploadComment({ comment, postId: selectedPostId });
    console.log("res : ",res);
    const newComments = [...comments, res];
    setComments(newComments);
    setComment("");
    setAddComment(false);
  };

  console.log("Comments : ",comments);

  return (
    <div
      className={`h-screen w-full bg-black/90 flex justify-center items-center ${
        commentUploaderOpen ? "absolute" : "hidden"
      }`}
    >
      <div className="w-11/12 md:w-7/12 lg:w-4/12 h-auto rounded-2xl shadow-lg border border-base-300 p-6 flex flex-col bg-base-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            {addComment ? "Add your comment" : "Comments"}
            {!addComment && (
              <button
              className="btn btn-sm ml-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setAddComment(true);
              }}
              >
              <PlusIcon className="mr-2" />
              Add Comment
            </button>
            )}
          </h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCloseCommentUploader();
            }}
            className="p-2 rounded-full hover:bg-base-300 transition"
          >
            <X />
          </button>
        </div>

        {addComment && (
          <div className="flex-grow overflow-y-auto no-scrollbar space-y-3">
            {commentUploading ? (
              <div className="flex flex-col justify-center items-center space-y-4 h-full">
                <span className="loading loading-bars loading-md"></span>
                <p>Comment uploading, please wait</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-between h-full"
              >
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your comment here..."
                  className="textarea textarea-bordered bg-base-200 placeholder-neutral-content resize-none min-h-[150px]"
                  required
                ></textarea>

                <div className="flex justify-end mt-4 space-x-3 items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAddComment(false);
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-neutral btn-sm">
                    Post Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment 
              key={comment?._id}
              profilePic={comment?.userId?.profilePic}
              userName={comment?.userId?.userName}
              content={comment?.content}
              createdAt={comment?.createdAt}
              likes={comment?.likes}
            />
          )
        )
        ) : (
          <p className="text-center my-4">
            No comments on this post, Be the first to add one
          </p>
        )}

      </div>
    </div>
  );
};

export default CommentUploader;
