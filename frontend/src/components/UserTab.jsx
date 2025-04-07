import PropTypes from "prop-types";

const UserTab = ({ sendConnection }) => {
  return (
    <button className={` w-full p-2 flex gap-3 items-center hover:bg-base-300 transition-colors `} >
      <div className="relative">
        <img
          src={"/user_avatar.jpg"}
          alt={"Profile"}
          className="size-10 object-cover rounded-full"
        />
      </div>
      <div className="w-10/12 flex justify-between">
        <div className="flex flex-col items-start">
          <p className="font-medium truncate">FullName</p>
          <p className="font-normal truncate text-stone-500">UserName</p>
        </div>
        <div className="flex flex-col justify-center">
          <button
            className="text-blue-400"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sendConnection();
            }}
          >
            Follow
          </button>
        </div>
      </div>
    </button>
  );
};

UserTab.propTypes = {
  sendConnection: PropTypes.func.isRequired,
};

export default UserTab;
