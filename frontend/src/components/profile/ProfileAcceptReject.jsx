import { memo } from "react";
import PropTypes from "prop-types";
import { useSearchStore } from "../../store/useSearchStore";

const ProfileAcceptReject = ({ userId, userName }) => {
  const {
    acceptRejectLoading,
    acceptConnectionRequest,
    rejectConnectionRequest,
  } = useSearchStore();

  const handleRequest = (id, e, accept) => {
    e.preventDefault();
    e.stopPropagation();
    if (accept) {
      acceptConnectionRequest(id, "accepted");
    } else {
      rejectConnectionRequest(id, "rejected");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="p-2 border border-base-300 shadow-lg rounded-lg md:w-6/12">
        <p className="text-center">{`Do you want to accept ${userName}'s request ?`}</p>
        <div className="py-4 flex justify-center space-x-2">
          {acceptRejectLoading ? (
            <span className="loading loading-bars loading-sm"></span>
          ) : (
            <>
              <button
                className="px-4 py-1 border border-blue-500 rounded-lg hover:bg-blue-500 btn-sm"
                onClick={(e) => handleRequest(userId, e, true)}
              >
                Accept
              </button>
              <button
                className="px-4 py-1 border border-red-500 rounded-lg hover:bg-red-500 btn-sm"
                onClick={(e) => handleRequest(userId, e, false)}
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileAcceptReject.propTypes = {
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

ProfileAcceptReject.displayName = "ProfileAcceptReject";
export default memo(ProfileAcceptReject);
