import PropTypes from "prop-types";
import { useSearchStore } from "../store/useSearchStore";

const UserProfileBar = ({ user }) => {
  const { _id, profilePic, name, fullName, userName } = user;

  const { getSearchSelectedUser } = useSearchStore();

  return (
    <button
      key={_id}
      onClick={() => getSearchSelectedUser(_id)}
      className={` w-full p-2 flex gap-3 items-center
      hover:bg-base-300 transition-colors border-b border-base-300`}
    >
      <div className="relative w-2/12">
        <img
          src={profilePic || "/user_avatar.jpg"}
          alt={name}
          className="size-10 object-cover rounded-full"
        />
      </div>

      <div className="w-10/12">
        <div className="flex justify-between">
          <p className="font-medium truncate">{fullName}</p>
        </div>
        <div className="text-sm flex">
          <p className="font-normal truncate text-stone-500">{userName}</p>
        </div>
      </div>
    </button>
  );
};

UserProfileBar.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    profilePic: PropTypes.string,
    name: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserProfileBar;
