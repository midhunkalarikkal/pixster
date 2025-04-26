import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { Ellipsis, Heart } from "lucide-react";

const Comment = ({ onLikeOrDislike, liked, isRepliesOn, replyCount, showReplies, showRepliesButton, onReply, showReplyButton, onDelete, profilePic, userName, createdAt, content, likes, userId, authUserId }) => {
    

  return (
    <div className="flex rounded-lg hover:bg-base-200 transition items-start gap-3 p-2 lg:p-3">
        
      <div className="pt-1 shrink-0">
        <img
          src={profilePic || "/user_avatar.jpg"}
          alt="User Avatar"
          className="size-8 lg:size-12 rounded-full"
        />
      </div>

      <div className="flex flex-col w-full space-y-1 items-start">
        <p className="font-medium text-sm">
          {userName}{" "}
          <span className="text-neutral-500 ml-2">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>{" "}
        </p>
        <p className="text-sm">
          {content}
        </p>

        <button className={`text-neutral-500 text-xs font-semibold ${!showReplyButton && 'hidden'}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onReply();
          }}
          >Reply</button>
          <div className="ml-10">
            {showRepliesButton && isRepliesOn &&(
              <button className="text-neutral-500 text-sm font-semibold"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showReplies();
              }}
              >View {replyCount} replies</button>
            )}
          </div>
        </div>

      <div className="pt-3 flex flex-col justify-center items-center">
        <button onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onLikeOrDislike();
        }}>
            <Heart className={`h-4 w-4 ${liked && 'fill-red-500 text-red-500'}`}/>
        </button>
            <span className="text-xs text-neutral-500">{likes}</span>
            { userId === authUserId && (
                <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete()
                }}>
                    <Ellipsis />
                </button>
            )}
      </div>
    </div>
  );
};

Comment.propTypes = {
  _id: PropTypes.string,
  profilePic: PropTypes.string,
  userName: PropTypes.string,
  createdAt: PropTypes.string,
  content: PropTypes.string,
  likes: PropTypes.number,
  userId: PropTypes.string,
  authUserId: PropTypes.string,
  onDelete: PropTypes.func,
  showReplyButton: PropTypes.bool,
  onReply: PropTypes.func,
  showRepliesButton: PropTypes.bool,
  showReplies: PropTypes.func,
  isRepliesOn: PropTypes.bool,
  replyCount: PropTypes.number,
  liked: PropTypes.bool,
  onLikeOrDislike: PropTypes.func,
};

export default Comment;
