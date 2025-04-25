import PropTypes from "prop-types";
import { memo } from "react";

const CustomButton = ({text, onClick}) => {
  return (
    <div className="relative group w-full flex justify-center">
      <button className="relative inline-block p-px font-semibold leading-6 bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 w-full md:w-10/12" onClick={onClick}>
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        <span className="relative block px-6 py-1 md:py-2 rounded-xl bg-base-300">
          <div className="relative flex items-center space-x-2 justify-center">
            <span className="transition-all duration-500 group-hover:translate-x-1">
              {text}
            </span>
          </div>
        </span>
      </button>
    </div>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default memo(CustomButton);
