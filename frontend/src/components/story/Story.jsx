import PropTypes from "prop-types";

const Story = ({ image, userName }) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <div className="p-[4px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full inline-block">
        <img
          src={image || "/noImg.png"}
          className="h-14 w-14 md:h-16 md:w-16 lg:h-20 lg:w-20 rounded-full object-cover"
        />
      </div>
      <p className="text-xs">{userName}</p>
    </div>
  );
};

Story.propTypes = {
  image: PropTypes.string,
  userName: PropTypes.string,
};

export default Story;
