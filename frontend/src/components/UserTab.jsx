import PropTypes from "prop-types";

const UserTab = ({
  showButton,
  user,
  buttonText,
  onButtonClick,
  onClickUser,
}) => {
  const { userName, fullName, profilePic, _id } = user;

  return (
    <div
      key={_id}
      onClick={() => onClickUser(_id)}
      className={`w-full p-1 lg:p-2 flex gap-3 items-center cursor-pointer
                  hover:bg-base-300 transition-colors border-b border-base-300`}
    >
      <div className="relative w-2/12">
        <img
          src={profilePic || "/user_avatar.jpg"}
          alt={userName}
          className="size-8 lg:size-10 object-cover rounded-full"
        />
      </div>

      <div className="w-10/12 flex justify-between">
        <div>
          <div className="flex justify-between">
            <p className="font-medium truncate">{fullName}</p>
          </div>
          <div className="text-sm flex">
            <p className="font-normal truncate text-stone-500">{userName}</p>
          </div>
        </div>
        <div className="flex items-center">
          {showButton && buttonText && onButtonClick && (
            <div className="flex items-center">
              <button
                className="px-2 py-1 border-0 text-blue-500 hover:text-blue-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onButtonClick(user, e);
                }}
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

UserTab.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
  }).isRequired,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  onClickUser: PropTypes.func,
};

export default UserTab;
