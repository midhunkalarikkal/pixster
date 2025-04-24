import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import InputWithLabel from "./InputWithLabel";
import { formatTime } from "../../utils/helpers";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthFormStore } from "../../store/useAuthFormStore";

const OtpVerifyForm = () => {
  const [resentLoading, setResendLoading] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
  });

  const { otpRemainingTime, otpTimerIsRunning, updateTimer } =
    useAuthFormStore();
  const { verifyOtp, loading, resendOtp } = useAuthStore();

  useEffect(() => {
    if (otpTimerIsRunning) {
      const interval = setInterval(() => {
        updateTimer();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimerIsRunning, updateTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOtp(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const res = await resendOtp();
      if (res.success) {
        toast.success(res.message);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputWithLabel
          label="Otp"
          type="otp"
          name="otp"
          value={formData.otp}
          onChange={handleChange}
          placeholder="0-0-0-0-0-0"
        />

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            "Verify"
          )}
        </button>
      </form>
      <p className="mt-6 flex justify-between text-xs md:text-sm/6 px-2">
        {resentLoading ? (
          <span className="font-semibold cursor-pointer">
            Sending
          </span>
        ) : otpTimerIsRunning ? (
          <span className="text-center text-xs md:text-sm/6">
            {formatTime(otpRemainingTime)}
          </span>
        ) : (
          <span
            className="font-semibold cursor-pointer"
            onClick={handleResendOtp}
          >
            Resend OTP
          </span>
        )}
      </p>
      <p className="text-base-content/60 text-sm">
        {
          "We've sent an OTP to your email. Please check your inbox — and don’t forget to look in the spam or junk folder, just in case!"
        }
      </p>
    </>
  );
};

export default OtpVerifyForm;
