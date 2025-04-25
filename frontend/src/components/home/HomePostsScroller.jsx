import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "../../store/usePostStore";
import { useSearchStore } from "../../store/useSearchStore";
import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";

const HomePostsScroller = ({ post }) => {

  const navigate = useNavigate();
  const [postLiked, setPostLiked] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);
  const [postSaved, setPostSaved] = useState(false);
  const [postCommentsCount, setPostCommentsCount] = useState(0)

  const { getSearchSelectedUser } = useSearchStore();
  const { likeOrDislikePost, saveRemovePost, setCommentUploaderOpen, setSelectedPostId } = usePostStore();

  useEffect(() => {
    if(post) {
      setPostLikeCount(post?.userPostDetails?.likes);
      setPostLiked(post?.userPostDetails?.likedByCurrentUser);
      setPostSaved(post?.userPostDetails?.savedByCurrentUser);
      setPostCommentsCount(post?.userPostDetails?.commentsCount);
    }
  },[post])

  const handleOpenCommentUploader = async (postId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCommentUploaderOpen(true);
    setSelectedPostId(postId);
  }

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

  const handleUserTabClick = async (userId) => {
    await getSearchSelectedUser(userId);
    navigate('/profile');
  };

  return (
    <div className="flex flex-col w-full md:w-11/12 lg:w-9/12 xl:w-7/12 p-1">
      {/* Post header */}
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-2 items-center">
          <img
            src={post?.profilePic || "/user_avatar.jpg"}
            alt="User avatar"
            className="h-8 w-8 lg:h-10 lg:w-10 rounded-full"
            onClick={() => handleUserTabClick(post?._id)}
          />
          <div
            className="flex flex-col space-y-1"
            onClick={() => handleUserTabClick(post?._id)}
          >
            <h5 className="font-semibold text-sm lg:text-md">{post?.userName}</h5>
          </div>
        </div>
        <Ellipsis className="cursor-pointer" />
      </div>

      {/* Post media */}
      <div className={`md:h-[28rem] lg:h-[32rem] w-full overflow-hidden bg-black ${post?.userPostDetails?.type === "Thread" && 'hidden'}`}>
        <img
          src={post?.userPostDetails?.media}
          alt="Post media"
          className="object-cover w-full h-full hover:object-contain"
        />
      </div>

      {/* Thread */}
      <div className={`h-auto p-6 border-[1px] border-base-300 rounded-md w-full overflow-hidden bg-black ${post?.userPostDetails?.type === "Post" && 'hidden'}`}>
        <p>{post?.userPostDetails?.content}</p>
      </div>

      {/* Post footer */}
      <div className="py-2 px-4 space-y-2">
        <div className="flex justify-between">
          <div className="flex space-x-4 items-center">
            <span className="flex items-center space-x-1">
              <Heart className={`cursor-pointer size-6 ${postLiked && 'fill-red-500 text-red-500'}`} 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLikeOrDislikePost(post?.userPostDetails?._id, e);
                }} 
              />
              <p>{postLikeCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle className="cursor-pointer size-6" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpenCommentUploader(post?.userPostDetails?._id, e)
                }}
              />
              <p>{postCommentsCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <Send className="size-6"/>
            </span>
          </div>
          <Bookmark className={`cursor-pointer size-6 ${postSaved && 'fill-blue-400 text-blue-400'} ${post?.userPostDetails?.type === "Thread" && 'hidden'}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePostSaveOrRemove(post?.userPostDetails?._id, e)
            }}
          />
        </div>
        <p className={`text-sm ${post?.userPostDetails?.type === "Thread" && 'hidden'}`}>
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
      media: PropTypes.string,
      content: PropTypes.string.isRequired,
      type: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      likedByCurrentUser: PropTypes.bool.isRequired,
      savedByCurrentUser: PropTypes.bool.isRequired,
      commentsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};

export default HomePostsScroller;
