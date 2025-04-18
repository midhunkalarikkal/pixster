import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns";

const NotificationBar = ({ user, onClick, message, time }) => {

  return (
    <button
      key={user._id}
      onClick={(e) => onClick(user._id, e)}
      className={`w-full md:w-8/12 lg:w-6/12 p-2 flex gap-3 items-center hover:bg-base-300 transition-colors border-b border-base-300`}
    >
      <div className="relative w-2/12">
        <img
          src={user.profilePic || "/user_avatar.jpg"}
          alt={user.userName}
          className="size-8 lg:size-10 object-cover rounded-full"
        />
      </div>

      <div className="w-10/12 flex flex-col">
        <div className="flex">
          <p className="font-medium truncate">
            {user.fullName + " " + message}
          </p>
        </div>
        <div className="text-sm flex items-center justify-between">
          <p className="text-xs truncate text-stone-500">{user.userName}</p>
          <p className="text-xs text-stone-500">
            {formatDistanceToNow(new Date(time), { addSuffix: true })}
          </p>
        </div>
      </div>
    </button>
  );
};

NotificationBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    userName: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  message: PropTypes.string,
  time: PropTypes.string,
};

export default NotificationBar;
