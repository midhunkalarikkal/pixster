import { memo } from "react";
import PropTypes from "prop-types";

const UserStat = ({ icon: Icon, count, label, onClick }) => {
  return (
    <button
      className="flex flex-col items-center"
      onClick={onClick}
      disabled={!onClick}
    >
      <Icon className="size-5 md:size-6 text-zinc-400" />
      <p className="text-md md:text-lg font-semibold">{count}</p>
      <p className="text-xs md:text-sm text-zinc-400">{label}</p>
    </button>
  );
};

UserStat.propTypes = {
  icon: PropTypes.elementType.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default memo(UserStat);
