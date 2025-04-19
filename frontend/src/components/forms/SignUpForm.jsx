import { useState } from "react";
import { Loader2 } from "lucide-react";
import InputWithLabel from "./InputWithLabel";
import { useAuthStore } from "../../store/useAuthStore";

const SignUpForm = () => {
  
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });

  const { signup, loading } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <InputWithLabel
        label="Fullname"
        type="text"
        name="fullName"
        value={formData.fullaName}
        onChange={handleChange}
        placeholder="Midhun Kalarikkal"
      />

      <InputWithLabel
        label="Username"
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        placeholder="midhun_kalarikkal_"
      />

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
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
