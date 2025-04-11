import PropTypes from "prop-types";
import { useSearchStore } from "../store/useSearchStore";
import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const HomePostsScroller = ({ post }) => {
  console.log("post : ", post);
  const { getSearchSelectedUser } = useSearchStore();

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
              <Heart />
              <p>{post?.userPostDetails?.likes}</p>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle />
              <p>{post?.userPostDetails?.commentsCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <Send />
            </span>
          </div>
          <Bookmark className="cursor-pointer" />
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
      likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      commentsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
  }).isRequired,
};

export default HomePostsScroller;
