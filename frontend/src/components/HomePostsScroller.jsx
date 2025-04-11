import { Bookmark, Ellipsis, Heart, MessageCircle, Send } from "lucide-react";
import PropTypes from "prop-types";

const HomePostsScroller = ({ post }) => {
  return (
    <div className="flex flex-col w-7/12">
      {/* Post header */}
      <div className="flex justify-between p-2 items-center">
        <div className="flex space-x-2 items-center">
          <img
            src={post?.userProfilePic || "/user_avatar.jpg"}
            alt="User avatar"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex flex-col space-y-1">
            <h5 className="font-semibold">{post.userName}</h5>
          </div>
        </div>
        <Ellipsis className="cursor-pointer" />
      </div>

      {/* Post media */}
      <div className="h-[32rem] w-full overflow-hidden bg-black">
        <img
          src={post.media}
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
              <p>{post.likes}</p>
            </span>
            <span className="flex items-center space-x-1">
              <MessageCircle />
              <p>{post.commentsCount}</p>
            </span>
            <span className="flex items-center space-x-1">
              <Send />
            </span>
          </div>
          <Bookmark className="cursor-pointer" />
        </div>
        <p className="text-sm text-gray-600">{post.content}</p>
      </div>
    </div>
  );
};

HomePostsScroller.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    media: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    userProfilePic: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    likes: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    commentsCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
};

export default HomePostsScroller;
