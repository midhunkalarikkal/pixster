import { useState } from "react";
import { Loader2 } from "lucide-react";
import InputWithLabel from "./InputWithLabel";
import { useAuthStore } from "../../store/useAuthStore";
import { useAuthFormStore } from "../../store/useAuthFormStore";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading } = useAuthStore();
  const { handleGoToEmailVerification } = useAuthFormStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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

      <button className="" onClick={(e) => {
        e.preventDefault();
        handleGoToEmailVerification();
      }}>Forgot Password ?</button>

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
          "Sign in"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
