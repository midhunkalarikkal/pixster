import LoginForm from "../components/forms/loginForm";
import SignUpForm from "../components/forms/signUpForm";
import { useAuthFormStore } from '../store/useAuthFormStore';
import AuthImagePattern from "../components/AuthImagePattern";
import OtpVerifyForm from "../components/forms/otpVerifyForm";
import { formBottomText, formTitle } from "../utils/constants";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import EmailVerificationForm from "../components/forms/emailVerificationForm";

const AuthPage = () => {

  const {
    loginForm,
    signUpForm,
    verifyOtpForm,
    verifyEmailForm,
    resetPasswordForm,
    handleGotoSignUp,
    handleGotoLogin,
  } = useAuthFormStore()

  const activeForm =
  loginForm
    ? "login"
    : signUpForm
    ? "signup"
    : verifyOtpForm
    ? "otp"
    : verifyEmailForm
    ? "email"
    : resetPasswordForm
    ? "reset"
    : "";

  return (
    <div className="h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h3 className="text-2xl font-bold italic">Talkzy</h3>
              <p className="text-base-content/60">
                {formTitle[activeForm]}
              </p>
            </div>
          </div>
          
          {loginForm && ( <LoginForm /> )}
          {signUpForm && ( <SignUpForm /> )}
          {verifyEmailForm && ( <EmailVerificationForm /> )}
          {verifyOtpForm && ( <OtpVerifyForm /> )}
          {resetPasswordForm && ( <ResetPasswordForm /> )}

          <div className="text-center">
            <p className="text-base-content/60">
              {formBottomText[activeForm]}
              {loginForm ? (
                <button className="underline ml-2" onClick={(e) => {
                  e.preventDefault();
                  handleGotoSignUp();
                }}>Sign Up</button>
              ) : signUpForm ? (
                <button className="underline ml-2" onClick={(e) => {
                  e.preventDefault();
                  handleGotoLogin();
                }}>Login</button>
              ) : (
                <button className="underline ml-2"onClick={(e) => {
                  e.preventDefault();
                  handleGotoLogin();
                }}>Cancel</button>
              )}
            </p>
          </div>
        </div>
      </div>

      <AuthImagePattern
        title={"Welcome to Talzy"}
        subtitle={
          "Sign in to continue your conversations and catch up with your messages."
        }
      />
    </div>
  );
};

export default AuthPage;
