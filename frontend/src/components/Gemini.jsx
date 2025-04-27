import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatTimeForClock } from "../utils/helpers";
import { useGeminiStore } from "../store/useGeminiStore";
import GeminiButton from "../components/Buttons/GeminiButton";
import { handleGenerateCaptions } from "../utils/createPageMethods";

const Gemini = ({ isPost }) => {
  
  const searchText = useRef(null);
  const countdownIntervalRef = useRef(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);

  const {
    geminiCaptions,
    setGeminiCaptions,
    requestCount,
    incrementRequestCount,
    resetRequestCount,
    lastRequestTime,
    setLastRequestTime,
    canGenerate,
  } = useGeminiStore();

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const lastReset = localStorage.getItem("lastRequestReset");

    if (lastReset !== today) {
      resetRequestCount();
      localStorage.setItem("lastRequestReset", today);
    }

    if (lastRequestTime) {
      const remaining = Math.floor(
        (lastRequestTime + 180000 - Date.now()) / 1000
      );
      if (remaining > 0) startCooldown(remaining);
    }

    return () => clearInterval(countdownIntervalRef.current);
  }, [lastRequestTime]);

  const startCooldown = (initialSeconds = 180) => {
    setCooldownRemaining(initialSeconds);
    clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`pb-20 ${!isPost && "hidden"}`}>
      <h2 className="text-lg md:text-xl font-semibold mt-10">
        Ask Gemini for stunning captions for your post
      </h2>
      <form
        onSubmit={(e) =>
          handleGenerateCaptions(
            e,
            searchText,
            requestCount,
            canGenerate,
            lastRequestTime,
            setGeminiCaptions,
            incrementRequestCount,
            setLastRequestTime,
            startCooldown
          )
        }
        className="w-full space-y-4 mt-2"
      >
        <input
          ref={searchText}
          className={`textarea textarea-bordered w-full`}
          placeholder="Tell me the theme of your post"
        />
        <GeminiButton text={"Generate"} />
      </form>
      {cooldownRemaining > 0 && (
        <div className="mt-4">
          <span>Cooldown Timer: </span>
          {formatTimeForClock(cooldownRemaining)}
        </div>
      )}

      <div
        className={`w-full mt-4 space-y-2 ${
          !geminiCaptions?.length && "hidden"
        }`}
      >
        <h2 className="text-lg ms:text-xl font-semibold mt-4">
          Here is the AI captions generated for you
        </h2>
        <ul className="list-disc list-inside">
          {geminiCaptions?.length > 0 &&
            geminiCaptions.map((caption, index) => (
              <li
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigator.clipboard.writeText(caption);
                  toast.success("Caption copied to clipboard");
                }}
                className="cursor-pointer flex items-center group"
              >
                {caption}
                <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <CopyIcon className="size-4" />
                </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

Gemini.propTypes = {
  isPost: PropTypes.bool,
};

export default Gemini;
