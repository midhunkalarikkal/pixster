import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useProfileStore } from "../../store/useProfileStore";
import { Edit, Heart, MessageCircleMore, Trash } from "lucide-react";
import ConfirmationDialog from "../ConfirmationDialog";
import { useNavigate } from "react-router-dom";

const ThreadGrid = ({ threads, authUserId, userDataId, onDelete }) => {

  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const { deletePost, setPostForUpdating } = useProfileStore();

  const confirmDelete = async (id) => {
    if (!id) {
      toast.error("Something went wrong.");
      return;
    }
    setDeletingIds(new Set(deletingIds.add(id)));

    const res = await deletePost(id);
    if (res && res.status === 200) {
      toast.success("Thread deleted successfully.");
      setDeleteTarget(null);
      onDelete(id);
      setDeletingIds(new Set([...deletingIds].filter((i) => i !== id)));
    }
  };

  const getUpdateThread = (thread) => {
    if (!thread) {
      toast.error("Something wnet wrong.");
      return;
    }
    setPostForUpdating(thread);
    navigate("/createPost");
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 p-[2px] gap-1">
        {threads.map((thread) => (
          <div
            key={thread._id}
            className="relative overflow-hidden group hover:cursor-pointer"
          >
            {deletingIds.has(thread._id) ? (
              <div className="h-96 w-full flex justify-center items-center">
                <span className="loading loading-bars loading-md"></span>
              </div>
            ) : (
              <>
                <div className="flex justify-center items-center w-auto min-h-36 md:min-h-36 lg:min-h-36 transition-opacity duration-300 group-hover:opacity-70 border-[1px] border-base-300 rounded-md p-2 md:p-0">
                  <p>{thread.content}</p>
                </div>

                <div className="absolute inset-0 z-20 hidden group-hover:flex flex-col items-center justify-center space-y-2 transition-opacity duration-300">
                  <div className={`flex space-x-4`}>
                    <p className="flex flex-col items-center">
                      <Heart className="size-5 md:size-6" />
                      {thread.likes}
                    </p>
                    <p className="flex flex-col items-center">
                      <MessageCircleMore className="size-5 md:size-6" />
                      {thread.commentsCount}
                    </p>
                  </div>
                  {authUserId === userDataId && (
                    <div className={`flex space-x-4`}>
                      <button
                        className="flex flex-col items-center text-red-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteTarget(thread._id);
                        }}
                      >
                        <Trash className="size-5 md:size-6" />
                      </button>
                      <button
                        className="flex flex-col items-center text-blue-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          getUpdateThread(thread)
                        }}
                      >
                        <Edit className="size-5 md:size-6" />
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
        content="Are you sure you want to delete this Thread?"
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

ThreadGrid.propTypes = {
  threads: PropTypes.array,
  onDelete: PropTypes.func,
  authUserId: PropTypes.string,
  userDataId: PropTypes.string,
};

export default ThreadGrid;
