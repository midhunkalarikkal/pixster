import model from "../utils/gemini";
import { toast } from "react-toastify";
import { CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import GeminiButton from "../components/GeminiButton";
import { useGeminiStore } from "../store/useGeminiStore";
import { GEMINI_QUERY_END, GEMINI_QUERY_INITAL } from "../utils/constants";

const Gemini = () => {
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
    
        // If user has an ongoing cooldown, resume timer
        if (lastRequestTime) {
          const remaining = Math.floor((lastRequestTime + 180000 - Date.now()) / 1000);
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

  const handleGenerateCaptions = (e) => {
    e.preventDefault();
    const query = searchText.current?.value?.trim();

    if (!query) return toast.info("Please tell me your taste of caption");

    if (requestCount >= 2) return toast.warning("Daily limit reached (2/2)");

    if (!canGenerate()) {
      const wait = Math.floor((lastRequestTime + 180000 - Date.now()) / 1000);
      return toast.info(`Please wait ${formatTime(wait)} before generating again`);
    }

    const geminiQuery =
      GEMINI_QUERY_INITAL + searchText.current.value + GEMINI_QUERY_END;

      toast.promise(
        (async () => {
          try {
            const result = await model.generateContent(geminiQuery);
            const response = await result.response;
            const text = response?.candidates[0]?.content?.parts[0]?.text;
            const cleanText = text.replace(/```json|```/g, "").trim();
            const captions = JSON.parse(cleanText);
            setGeminiCaptions(captions);
            incrementRequestCount();
            setLastRequestTime(Date.now());
            startCooldown();
          } catch {
            toast.error("Something went wrong. Try again.");
          }
        })(),
        {
          pending: "Generating captions...",
          success: "Captions ready!",
          error: "Failed to generate.",
        }
      );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="mb-10">
      <h2 className="text-lg md:text-xl font-semibold mt-10">
        Ask Gemini for stunning captions for your post
      </h2>
      <form onSubmit={handleGenerateCaptions} className="w-full space-y-4 mt-2">
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
          {formatTime(cooldownRemaining)}
        </div>
      )}

      <div className="w-full mt-4 space-y-2">
        <h2 className="text-lg ms:text-xl font-semibold mt-4">Here is the AI captions generated for you</h2>
        <ul className="list-disc list-inside">
          {geminiCaptions &&
            geminiCaptions.length > 0 &&
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

export default Gemini;
