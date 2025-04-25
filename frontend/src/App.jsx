import Layout from "./pages/Layout";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import { useEffect, lazy, Suspense } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { Navigate, Route, Routes } from "react-router-dom";

const ChatPage = lazy(() => import("./pages/ChatPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const CreatePost = lazy(() => import("./pages/CreatePost"));

const Hello = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div
        className="flex items-center justify-center h-screen"
        data-theme={theme}
      >
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  return (
    <div data-theme={theme}>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-bars loading-lg"></span>
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={authUser ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<HomePage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="createPost" element={<CreatePost />} />
          </Route>
          <Route
            path="/login"
            element={!authUser ? <AuthPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Hello;
