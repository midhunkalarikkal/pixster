import { create } from "zustand";

export const useAuthFormStore = create(() => ({
    loginForm: true,
    signUpForm: false,
    verifyOtpForm: false,
    verifyEmailForm: false,
    resetPasswordForm: false,
    forgotPassword: false,
    otpRemainingTime: 0,
    otpTimerIsRunning: false,
}))