import { memo } from "react";
import PropTypes from "prop-types";
import { AlignJustify } from "lucide-react";
import { useProfileStore } from "../../store/useProfileStore";

const ProfileHeadDropdown = ({
  authUserId,
  userId,
  getRequestedProfiles,
  getIncomingRequestedProfiles,
  setListPage,
}) => {

  const { setTab } = useProfileStore();

  const isHidden = authUserId !== userId;

  return (
    <div className={`flex justify-start ${isHidden ? "hidden" : ""}`}>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="m-1 rounded-lg">
          <AlignJustify />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm z-10 transition-all duration-300 transform opacity-0 scale-95 dropdown-open:opacity-100 dropdown-open:scale-100"
        >
          <li>
            <button
              className="w-full text-sm font-medium py-2 px-4 rounded-md"
              onClick={() => {
                getRequestedProfiles();
                setListPage(true);
                setTab(4);
              }}
            >
              Requested Profiles
            </button>
          </li>
          <li>
            <button
              className="w-full text-sm font-medium py-2 px-4 rounded-md"
              onClick={() => {
                getIncomingRequestedProfiles();
                setListPage(true);
                setTab(5);
              }}
            >
              Incoming Requests
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProfileHeadDropdown.propTypes = {
  authUserId: PropTypes.string,
  userId: PropTypes.string,
  getRequestedProfiles: PropTypes.func.isRequired,
  getIncomingRequestedProfiles: PropTypes.func.isRequired,
  setListPage: PropTypes.func.isRequired,
};

export default memo(ProfileHeadDropdown);
