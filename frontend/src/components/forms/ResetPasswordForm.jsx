import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import InputWithLabel from "./InputWithLabel";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthFormStore } from "../../store/useAuthFormStore";

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    conformPassword: "",
  });

  const { updatePassword, loading } = useAuthStore();
  const { handleGotoLogin } = useAuthFormStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updatePassword({
      password : formData.password
    });
    if(res.success) {
      toast.success(res.message);
      handleGotoLogin();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputWithLabel
        label="Password"
        type={showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        isPasswordField={true}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <InputWithLabel
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confrrmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        isPasswordField={true}
        showPassword={showConfirmPassword}
        setShowPassword={setShowConfirmPassword}
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
          "Submit"
        )}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
