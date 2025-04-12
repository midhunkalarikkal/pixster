import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { usePostStore } from "../store/usePostStore";
import { useSearchStore } from "../store/useSearchStore";
import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";

const HomePostsScroller = ({ post }) => {

  const [postLiked, setPostLiked] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);

  const [postSaved, setPostSaved] = useState(false);

  const { getSearchSelectedUser } = useSearchStore();
  const { likeOrDislikePost, saveRemovePost } = usePostStore();

  useEffect(() => {
    if(post) {
      setPostLikeCount(post?.userPostDetails?.likes);
      setPostLiked(post?.userPostDetails?.likedByCurrentUser);
      setPostSaved(post?.userPostDetails?.savedByCurrentUser);
    }
  },[post])

  const handlePostSaveOrRemove = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await saveRemovePost(postId);
    if(res.saved) {
      setPostSaved(true);
    } else if(res.removed) {
      setPostSaved(false);
    }
  }

  const handleLikeOrDislikePost = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await likeOrDislikePost(postId);
    if(res.liked) {
      setPostLiked(true);
      setPostLikeCount((prev) => prev + 1);
    } else if(res.disliked){
      setPostLiked(false);
      setPostLikeCount((prev) => prev - 1);
    }
  }

  const handleUserTabClick = (userId) => {
    getSearchSelectedUser(userId);
  };

  return (
    <div className="flex flex-col w-7/12">
      {/* Post header */}
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-2 items-center">
          <img
            src={post?.profilePic || "/user_avatar.jpg"}
            alt="User avatar"
            className="h-10 w-10 rounded-full"
            onClick={() => handleUserTabClick(post?._id)}
          />
          <div
            className="flex flex-col space-y-1"
            onClick={() => handleUserTabClick(post?._id)}
          >
            <h5 className="font-semibold">{post?.userName}</h5>
          </div>
        </div>
        <Ellipsis className="cursor-pointer" />
      </div>

      {/* Post media */}
      <div className="h-[32rem] w-full overflow-hidden bg-black">
        <img
          src={post?.userPostDetails?.media}
          alt="Post media"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Post footer */}
      <div className="py-2 px-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-4 items-center">
            <span className="flex items-center space-x-1">
              <Heart className={`cursor-pointer ${postLiked && 'fill-red-500 text-red-500'}`} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLikeOrDislikePost(post?.userPostDetails?._id, e);
                }} 
              />
              <p>{postLikeCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="cursor-pointer" />
              <p>{post?.userPostDetails?.commentsCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <Send />
            </span>
          </div>
          <Bookmark className={`cursor-pointer ${postSaved && 'fill-blue-400 text-blue-400'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePostSaveOrRemove(post?.userPostDetails?._id, e)
            }}
          />
        </div>
        <p className="text-sm">
          {post?.userPostDetails?.content}
        </p>
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(post?.userPostDetails?.createdAt), {addSuffix : true })}
        </p>
      </div>
    </div>
  );
};

HomePostsScroller.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    userName: PropTypes.string.isRequired,
    userPostDetails: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      media: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      likedByCurrentUser: PropTypes.bool.isRequired,
      savedByCurrentUser: PropTypes.bool.isRequired,
      commentsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};

export default HomePostsScroller;
