import PropTypes from "prop-types";

const SuggestionCard = ({ user, showButton, buttonText, onButtonClick, onClickUser }) => {
  return (
    <div className="bg-base-200 flex flex-col h-auto w-48 justify-center items-center rounded-md shadow-md px-6 py-4 cursor-pointer"
        onClick={() => onClickUser(user?._id)}
    >
      <div className="bg-base-100 rounded-full">
        <img
          src={user.profilePic || "/user_avatar.jpg"}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center items-center mt-4 w-full">
        <p className="text-sm">{user.fullName}</p>
        <p className="text-sm text-base-content/60">{user.userName}</p>
        {showButton && buttonText && onButtonClick && ( 
        <button className="btn btn-xs bg-blue-600 hover:bg-blue-500 w-full rounded-md mt-4 text-white">
            {buttonText}
        </button>
        )}
      </div>
    </div>
  );
};

SuggestionCard.propTypes = {
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

export default SuggestionCard;
