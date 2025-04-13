import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";
import { Ellipsis, Heart } from "lucide-react";

const Comment = ({ profilePic, userName, createdAt, content, likes, userId, authUserId }) => {
  return (
    <div className="flex rounded-lg hover:bg-base-200 transition items-start gap-3 p-3">
        
      <div className="w-[15%] pt-1">
        <img
          src={profilePic || "/user_avatar.jpg"}
          alt="User Avatar"
          className="w-full h-auto rounded-full"
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
        <button className="text-neutral-500 text-xs">Reply</button>
      </div>

      <div className="w-[10%] pt-3 flex flex-col justify-center items-center">
            <Heart className={`h-4 w-4`}/>
            <span className="text-xs text-neutral-500">{likes}</span>
            { userId === authUserId && (
                <button onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
};

export default Comment;
