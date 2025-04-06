import PropTypes from "prop-types";

const NotificationBar = ({ user, onAcceptRequest, onClick, isHaveButton, buttonText, message }) => {

  return (
    <button
      key={user._id}
      onClick={() => onClick(user._id)}
      className={`w-full md:w-8/12 p-2 flex gap-3 items-center hover:bg-base-300 transition-colors border-b border-base-300`}
    >
      <div className="relative w-2/12">
        <img
          src={user.profilePic || "/user_avatar.jpg"}
          alt={user.userName}
          className="size-10 object-cover rounded-full"
        />
      </div>

      <div className="w-10/12 flex justify-between">
        <div>
          <div className="flex justify-between">
            <p className="font-medium truncate">{user.userName +" "+message}</p>
          </div>
          <div className="text-sm flex">
            <p className="font-normal truncate text-stone-500">
              {user.userName}
            </p>
          </div>
        </div>
        {isHaveButton && buttonText && (
          <div className="flex items-center">
          <a
            className="px-2 py-1 border border-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={(e) => onAcceptRequest(user._id, e)}
            >
            {buttonText}
          </a>
        </div>
          )}
      </div>
    </button>
  );
};

NotificationBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    userName: PropTypes.string.isRequired,
  }),
  onAcceptRequest: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
  isHaveButton: PropTypes.bool,
  message: PropTypes.string,
};

export default NotificationBar;
