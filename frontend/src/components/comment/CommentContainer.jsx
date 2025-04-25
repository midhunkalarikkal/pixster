import Comment from "./Comment";
import { toast } from "react-toastify";
import { PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";

const CommentContainer = () => {
  const {
    commentUploading,
    commentUploaderOpen,
    setCommentUploaderOpen,
    uploadComment,
    setSelectedPostId,
    selectedPostId,
    getComments,
    commentsLoading,
    deleteComment,
    likeOrDislikeComment,
  } = usePostStore();

  const { authUser } = useAuthStore();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [addComment, setAddComment] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [repliesVisible, setRepliesVisible] = useState({});
  const [likedComment, setLikedComment] = useState({});

  const toggleReplies = (commentId) => {
    setRepliesVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const fetchAllComments = async () => {
    const res = await getComments({ postId: selectedPostId });
    setComments(res);
  };

  useEffect(() => {
    if (!selectedPostId) return;
    fetchAllComments();
  }, [selectedPostId]);

  const handleReplyClick = async (commentId) => {
    setAddComment(true);
    setParentCommentId(commentId);
  };

  const handleCloseCommentUploader = () => {
    setCommentUploaderOpen(false);
    setSelectedPostId(null);
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteConfirm(true);
  };

  const handleCommentLikeOrDislike = async(commentId) => {
    if(!commentId) return;

    try {
      const res = await likeOrDislikeComment({commentId});
      if (res.success) {
        if (res.liked) {
          setLikedComment((prev) => ({
            ...prev,
            [commentId]: true,
          }));
      
          if (res.isRootComment) {
            const updatedComments = comments.map((comment) =>
              comment._id.toString() === commentId.toString()
                ? { ...comment, likes: comment.likes + 1 }
                : comment
            );
            setComments(updatedComments);
      
          } else {
            const updatedComments = comments.map((comment) => {
              if (comment._id.toString() === res.parentCommentId.toString()) {
                const updatedReplies = comment.replies?.map((reply) => {
                  if (reply._id.toString() === commentId.toString()) {
                    return { ...reply, likes: reply.likes + 1 };
                  }
                  return reply;
                });
                return { ...comment, replies: updatedReplies };
              }
              return comment;
            });
            setComments(updatedComments);
          }
      
        } else if (res.disliked) {
          setLikedComment((prev) => ({
            ...prev,
            [commentId]: false,
          }));

          if (res.isRootComment) {
            const updatedComments = comments.map((comment) =>
              comment._id.toString() === commentId.toString()
                ? { ...comment, likes: comment.likes - 1 }
                : comment
            );
            setComments(updatedComments);
      
          } else {
            const updatedComments = comments.map((comment) => {
              if (comment._id.toString() === res.parentCommentId.toString()) {
                const updatedReplies = comment.replies?.map((reply) => {
                  if (reply._id.toString() === commentId.toString()) {
                    return { ...reply, likes: reply.likes - 1 };
                  }
                  return reply;
                });
                return { ...comment, replies: updatedReplies };
              }
              return comment;
            });
            setComments(updatedComments);
          }
          
        }
      }
    } catch {
      toast.error("Please try again.");
    }
  }

  const confirmDeleteComment = async () => {
    if (!selectedPostId || !commentToDelete) return;

    try {
      const res = await deleteComment({
        commentId: commentToDelete,
        postId: selectedPostId,
      });
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
      }
    } catch {
      toast.error("Failed to delete comment.");
    } finally {
      setShowDeleteConfirm(false);
      setCommentToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment || !selectedPostId) {
      toast.error("Something went wrong, please try again.");
      return;
    }

    const res = await uploadComment({
      comment,
      postId: selectedPostId,
      parentCommentId,
    });
    if (!res.isRootComment) {
      const newComments = comments.map((comment) => {
        if (comment._id === res.parentCommentId) {
          return {
            ...comment,
            replies: [...comment.replies, res],
          };
        }
        return comment;
      });
      setComments(newComments);
      setComment("");
      setParentCommentId(null);
      setAddComment(false);
    } else {
      const newComments = [...comments, res];
      setComments(newComments);
      setComment("");
      setAddComment(false);
    }
  };

  return (
    <div
      className={`h-screen w-full bg-black/90 flex justify-center items-center ${
        commentUploaderOpen ? "absolute" : "hidden"
      }`}
    >
      <div className="w-11/12 md:w-7/12 lg:w-4/12 h-auto rounded-2xl shadow-lg border border-base-300 p-6 flex flex-col bg-base-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md lg:text-lg font-semibold flex items-center">
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
                <p className="text-md lg:text-lg">Comment uploading, please wait</p>
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

        <div className="overflow-y-scroll no-scrollbar max-h-[450px]">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment?._id}>
                <Comment
                  _id={comment?._id}
                  content={comment?.content}
                  createdAt={comment?.createdAt}
                  likes={comment?.likes}
                  userId={comment?.user?._id}
                  userName={comment?.user?.userName}
                  profilePic={comment?.user?.profilePic}
                  authUserId={authUser?._id}
                  onDelete={() => handleDeleteClick(comment?._id)}
                  showReplyButton={true}
                  onReply={() => handleReplyClick(comment?._id)}
                  showRepliesButton={comment?.replies?.length > 0}
                  showReplies={() => toggleReplies(comment._id)}
                  replyCount={comment?.replies?.length}
                  isRepliesOn={!!repliesVisible[comment?._id]}
                  liked={comment?.commentLikedByAuthUser || likedComment[comment?._id]}
                  onLikeOrDislike={() =>handleCommentLikeOrDislike(comment?._id)}
                />
                {comment?.replies && comment?.replies?.length > 0 && (
                  <div
                    className={`ml-10 ${repliesVisible[comment._id] && "hidden"}`}
                  >
                    {comment?.replies.map((reply) => (
                      <Comment
                        key={reply?._id}
                        _id={reply?._id}
                        content={reply?.content}
                        createdAt={reply?.createdAt}
                        likes={reply?.likes}
                        userId={reply?.user?._id}
                        userName={reply?.user?.userName}
                        profilePic={reply?.user?.profilePic}
                        authUserId={authUser._id}
                        onDelete={() => handleDeleteClick(reply?._id)}
                        liked={reply?.commentLikedByAuthUser || likedComment[reply?._id]}
                        onLikeOrDislike={() => handleCommentLikeOrDislike(reply?._id)}
                      />
                    ))}
                    <button
                      className="text-neutral-500 text-sm font-semibold ml-10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleReplies(comment._id);
                      }}
                    >
                      Hide replies
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : commentsLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-bars loading-md"></span>
            </div>
          ) : (
            <p className="text-center my-4">
              No comments on this post, Be the first to add one
            </p>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-[90%] max-w-sm space-y-4">
            <h3 className="text-lg font-semibold">Delete Comment</h3>
            <p>Are you sure you want to delete this comment?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCommentToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={confirmDeleteComment}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentContainer;
