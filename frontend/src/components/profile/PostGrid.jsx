import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { usePostStore } from "../../store/usePostStore";
import { useProfileStore } from "../../store/useProfileStore";
import { Edit, Heart, MessageCircleMore, Trash } from "lucide-react";

const PostGrid = ({ posts, onDelete, onRemove, saved }) => {

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const { deletePost } = useProfileStore();
  const { setPostForUpdating } = useProfileStore();
  const { saveRemovePost } = usePostStore();

  const removeFromSaved = async (postId) => {
    const res = await saveRemovePost(postId);
    if(res.removed) {
      onRemove(postId);
      toast.success("Post removed from your save list.");
    }
  }

  const confirmDelete = async (id) => {
    if (!id) {
      toast.error("Something went wrong.");
      return;
    }
    setDeleting(true);

    const res = await deletePost(id);
    if (res && res.status === 200) {
      toast.success("Post deleted successfully.");
      setDeleteTarget(null);
      onDelete(id);
      setDeleting(false);
    }
  };

  const getUpdatePost = (post) => {
    if (!post) {
      toast.error("Something wnet wrong.");
      return;
    }
    setPostForUpdating(post);
    navigate("/createPost");
  };

  if (!posts) {
    return <PostsSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 p-[2px] gap-1">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative overflow-hidden group hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
            }}
          >
            {deleting ? (
              <div className="h-96 w-full flex justify-center items-center">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : (
              <>
                <img
                  className="h-96 w-auto object-cover transition-opacity duration-300 group-hover:opacity-70"
                  src={post.media || "/user_avatar.jpg"}
                  alt={`Post by user`}
                />
                <div className="absolute inset-0 z-20 hidden group-hover:flex flex-col items-center justify-center space-y-2 transition-opacity duration-300">
                  <div className={`flex space-x-4 ${!saved && 'hidden'}`}>
                    <button
                      className="flex flex-col items-center text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromSaved(post._id);
                      }}
                    >
                      <Trash />
                    </button>
                  </div>
                  <div className={`flex space-x-4 ${saved && 'hidden'}`}>
                    <p className="flex flex-col items-center">
                      <Heart />
                      {post.likes}
                    </p>
                    <p className="flex flex-col items-center">
                      <MessageCircleMore />
                      {post.commentsCount}
                    </p>
                  </div>
                  <div className={`flex space-x-4 ${ saved && 'hidden' }`}>
                    <button
                      className="flex flex-col items-center text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteTarget(post._id);
                      }}
                    >
                      <Trash />
                    </button>
                    <button
                      className="flex flex-col items-center text-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        getUpdatePost(post);
                      }}
                    >
                      <Edit />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {deleteTarget && (
        <dialog
          id="delete_modal"
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">Are you sure you want to delete this post?</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn" onClick={() => setDeleteTarget(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => confirmDelete(deleteTarget)}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

PostGrid.propTypes = {
  posts: PropTypes.array,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  saved: PropTypes.bool,
};

export default PostGrid;
