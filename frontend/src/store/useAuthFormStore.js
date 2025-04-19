import { create } from "zustand";

export const useAuthFormStore = create((set) => ({
    loginForm: true,
    signUpForm: false,
    verifyOtpForm: false,
    verifyEmailForm: false,
    resetPasswordForm: false,
    forgotPassword: false,
    otpRemainingTime: 0,
    otpTimerIsRunning: false,

    handleGotoSignUp: () => {
        set({
            loginForm : false,
            signUpForm : true,
            verifyOtpForm : false,
            verifyEmailForm : false,
            resetPassword : false,
        });
    },

    handleGotoLogin: () => {
        set({
            loginForm : true,
            signUpForm : false,
            verifyOtpForm : false,
            verifyEmailForm : false,
            resetPassword : false,
        })
    }
}))