import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import InputWithLabel from "./InputWithLabel";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthFormStore } from "../../store/useAuthFormStore";

const EmailVerificationForm = () => {
  const [formData, setFormData] = useState({
    email: "",
  });

  const { resendOtp, loading } = useAuthStore();
  const { handleGotoVerifyOtp, startTimer } = useAuthFormStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await resendOtp(formData);
    if (res.success) {
      toast.success(res.message);
      handleGotoVerifyOtp();
      startTimer();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputWithLabel
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="midhun@gmail.com"
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
  );
};

export default EmailVerificationForm;
