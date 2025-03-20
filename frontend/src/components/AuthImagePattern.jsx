import PropTypes from "prop-types";
import { pairedMessages } from "../constants";

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="text-center w-xl">
        <div className="">
          {pairedMessages.map((chat, index) => (
            <div key={index} className="">
              <div className="chat chat-end my-2">
                <div className="chat-bubble">{chat.sender.text}</div>
              </div>

              <div className="chat chat-start my-2">
                <div className="chat-bubble">
                  {chat.receiver.text}
                </div>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

AuthImagePattern.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default AuthImagePattern;
