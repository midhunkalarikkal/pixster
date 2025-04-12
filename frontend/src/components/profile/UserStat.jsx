import { memo } from "react";
import PropTypes from "prop-types";

const UserStat = ({ icon: Icon, count, label, onClick }) => {
  return (
    <button
      className="flex flex-col items-center"
      onClick={onClick}
      disabled={!onClick}
    >
      <Icon className="w-6 h-6 text-zinc-400" />
      <p className="text-lg font-semibold">{count}</p>
      <p className="text-sm text-zinc-400">{label}</p>
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
