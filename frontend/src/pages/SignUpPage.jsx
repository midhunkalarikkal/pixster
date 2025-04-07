import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { validateEmail, validateFullName, validatePassword, validateUsername } from "../utils/validator";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState();

  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [fullNameError, setFullNameError] = useState(null);
  const [userNameError, setUserNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if(formData.fullName === "" ||
      formData.userName === "" ||
      formData.email === "" ||
      formData.password === ""
    ){
      toast.error("Fill all fields.");
      return false;
    }
    const fullNameError = validateFullName(formData.fullName);
    const userNameError = validateUsername(formData.userName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setFullNameError(fullNameError);
    setUserNameError(userNameError);
    setEmailError(emailError);
    setPasswordError(passwordError);

    if (fullNameError || 
      userNameError || 
      emailError || 
      passwordError) {
      toast.error("Please fix the form error.");
      return false;
    }
    return true;
    
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  const checkInput = (e, field) => {
    let error = null;
    switch (field) {
        case "fullName":
            error = validateFullName(e.target.value);
            setFullNameError(error);
            break;
        case "userName":
            error = validateUsername(e.target.value);
            setUserNameError(error);
            break;
        case "email":
            error = validateEmail(e.target.value);
            setEmailError(error);
            break;
        case "password":
            error = validatePassword(e.target.value);
            setPasswordError(error);
            break;
        default:
            break;
    }
};

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-0">
          <div className="text-center mb-8">
            <div className="flex flex-col text-center gap-2 group">
              <div className="flex flex-col items-center gap-2 group">
                <h3 className="text-2xl font-bold italic">Talkzy</h3>
                <p className="text-base-content/60">
                  Create you account and explore talkzy
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Fullname</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName}
                  onInput={(e) => checkInput(e, "fullName")}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
                {fullNameError && <p className="text-red-500 text-sm mt-1">{fullNameError}</p>}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John_d_e"
                  value={formData.userName}
                  onInput={(e) => checkInput(e, "userName")}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
                {userNameError && <p className="text-red-500 text-sm mt-1">{userNameError}</p>}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onInput={(e) => checkInput(e, "email")}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password}
                  onInput={(e) => checkInput(e, "password")}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center py-6">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                login
              </Link>
            </p>
          </div>
          
        </div>
      </div>

      <AuthImagePattern
              title={"Welcome to Talzy"}
              subtitle={"Sign in to continue your conversations and catch up with your messages."}
            />

    </div>
  );
};

export default SignUpPage;
