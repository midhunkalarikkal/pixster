import { memo } from "react";
import PropTypes from "prop-types";

const ListMessage = ({ authUserId, userDataId, tabNum }) => {

  const authUserMessage = [
    "You don't have any followers yet.",
    "You haven't followed anyone yet.",
  ];
  const userMessage = [
    "This user has no followers.",
    "This user has no followings at the moment.",
  ];

  const getMessage = () => {
    if (tabNum === 2) {
      return "You haven't requested any profiles at the moment.";
    }

    if (tabNum === 3) {
      return "You haven't received any request at the moment.";
    }

    return authUserId === userDataId
      ? authUserMessage[tabNum]
      : userMessage[tabNum];
  };

  return <p className="text-center text-sm mt-10">{getMessage()}</p>;
};

ListMessage.propTypes = {
  tabNum: PropTypes.number.isRequired,
  authUserId: PropTypes.string,
  userDataId: PropTypes.string,
};

export default memo(ListMessage);
