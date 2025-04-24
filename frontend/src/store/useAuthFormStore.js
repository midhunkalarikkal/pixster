import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export const useAuthFormStore = create((set, get) => ({
  loginForm: true,
  signUpForm: false,
  verifyOtpForm: false,
  verifyEmailForm: false,
  resetPasswordForm: false,
  forgotPassword: false,
  otpRemainingTime: 0,
  otpTimerIsRunning: false,

  handleGotoSignUp: () => {
    const { changeLoading } = useAuthStore.getState();
    changeLoading(false);
    set({
      loginForm: false,
      signUpForm: true,
      verifyOtpForm: false,
      verifyEmailForm: false,
      resetPasswordForm: false,
    });
  },

  handleGotoLogin: () => {
    const { changeLoading } = useAuthStore.getState();
    changeLoading(false);
    set({
      loginForm: true,
      signUpForm: false,
      verifyOtpForm: false,
      verifyEmailForm: false,
      resetPasswordForm: false,
    });
  },

  handleGotoVerifyOtp: () => {
    const { changeLoading } = useAuthStore.getState();
    changeLoading(false);
    set({
        loginForm: false,
        signUpForm: false,
        verifyOtpForm: true,
        verifyEmailForm: false,
        resetPasswordForm: false,
      });
  },

  handleGoToEmailVerification: () => {
    const { changeLoading } = useAuthStore.getState();
    changeLoading(false);
    set({
        loginForm: false,
        signUpForm: false,
        verifyOtpForm: false,
        verifyEmailForm: true,
        forgotPassword: true,
        resetPasswordForm: false,
      });
  },

  handleGotoResetPassword: () => {
    const { changeLoading } = useAuthStore.getState();
    changeLoading(false);
    set({
        loginForm: false,
        signUpForm: false,
        verifyOtpForm: false,
        verifyEmailForm: false,
        resetPasswordForm: true,
      });
  },

  updateTimer: () => {
    const { otpRemainingTime, otpTimerIsRunning } = get();
    if (otpRemainingTime > 0 && otpTimerIsRunning) {
      set((state) => ({
        otpRemainingTime: state.otpRemainingTime - 1,
      }));
    } else {
      set({ otpTimerIsRunning: false });
    }
  },

  stopTimer: () => {
    set({ otpTimerIsRunning: false });
  },

  startTimer: () => {
    set({ otpTimerIsRunning : true });
    set({ otpRemainingTime : 300 });
  }
}));
