import gsap from "gsap";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { pairedMessages } from "../utils/constants";

const AuthImagePattern = ({ title, subtitle }) => {
  const sendMessageRefs = useRef([]);
  const recieveMessageRefs = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.to(containerRef.current, {
      y: 10,
      duration: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    sendMessageRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          x: 50,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    });

    recieveMessageRefs.current.forEach((ref) => {
      if (ref) {
        gsap.to(ref, {
          x: -50,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    });
  }, []);

  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="text-center w-xl">
        <div className="" ref={containerRef}>
          {pairedMessages.map((chat, index) => (
            <div key={index}>
              <div
                className="chat chat-end my-2"
                ref={(el) => (sendMessageRefs.current[index * 2] = el)}
              >
                <div className="chat-bubble truncate">{chat.sender.text}</div>
              </div>

              <div
                className="chat chat-start my-2"
                ref={(el) => (recieveMessageRefs.current[index * 2] = el)}
              >
                <div className="chat-bubble truncate">{chat.receiver.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

AuthImagePattern.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default AuthImagePattern;
