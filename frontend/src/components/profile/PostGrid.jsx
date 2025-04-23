import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PostsSkeleton from "../skeletons/PostsSkeleton";
import { usePostStore } from "../../store/usePostStore";
import { useProfileStore } from "../../store/useProfileStore";
import { Edit, Heart, MessageCircleMore, Trash } from "lucide-react";
import ConfirmationDialog from "../ConfirmationDialog";

const PostGrid = ({ posts, onDelete, onRemove, saved, authUserId, userDataId }) => {

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const navigate = useNavigate();

  const { deletePost, setPostForUpdating } = useProfileStore();
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
    setDeletingIds(new Set(deletingIds.add(id)));

    const res = await deletePost(id);
    if (res && res.status === 200) {
      toast.success("Post deleted successfully.");
      setDeleteTarget(null);
      onDelete(id);
      setDeletingIds(new Set([...deletingIds].filter((i) => i !== id)));
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
          >
            {deletingIds.has(post._id) ? (
              <div className="h-96 w-full flex justify-center items-center">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : (
              <>
                <img
                  className="h-48 md:h-72 lg:h-96 w-auto object-cover transition-opacity duration-300 group-hover:opacity-70"
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
                      <Trash className="size-5 md:size-6"/>
                    </button>
                  </div>
                  <div className={`flex space-x-4 ${saved && 'hidden'}`}>
                    <p className="flex flex-col items-center">
                      <Heart className="size-5 md:size-6"/>
                      {post.likes}
                    </p>
                    <p className="flex flex-col items-center">
                      <MessageCircleMore className="size-5 md:size-6"/>
                      {post.commentsCount}
                    </p>
                  </div>
                  { authUserId === userDataId && (
                    <div className={`flex space-x-4 ${ saved && 'hidden' }`}>
                    <button
                      className="flex flex-col items-center text-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteTarget(post._id);
                      }}
                      >
                      <Trash className="size-5 md:size-6"/>
                    </button>
                    <button
                      className="flex flex-col items-center text-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        getUpdatePost(post);
                      }}
                      >
                      <Edit className="size-5 md:size-6"/>
                    </button>
                  </div>
                    )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        title="Confirm Deletion"
        content="Are you sure you want to delete this Post?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            confirmDelete(deleteTarget);
          }
        }}
      />
    </div>
  );
};

PostGrid.propTypes = {
  posts: PropTypes.array,
  onDelete: PropTypes.func,
  onRemove: PropTypes.func,
  saved: PropTypes.bool,
  authUserId: PropTypes.string,
  userDataId: PropTypes.string,
};

export default PostGrid;
