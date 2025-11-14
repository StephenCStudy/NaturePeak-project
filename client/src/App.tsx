import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import BannedCheckWrapper from "./components/BannedCheckWrapper";
import HomePage from "./pages/home/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListingPage from "./pages/posts/ListingPage";
import PostDetailPage from "./pages/posts/PostDetailPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import SupportPage from "./pages/legal/SupportPage";
import ProfilePage from "./pages/user/ProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";
import ChangePasswordPage from "./pages/user/ChangePasswordPage";
import MyPostsPage from "./pages/user/MyPostsPage";
import AddPostPage from "./pages/posts/AddPostPage";
import AdminPage from "./pages/admin/AdminPage";
import AgentPage from "./pages/agent/AgentPage";
import AgentLoginPage from "./pages/agent/AgentLoginPage";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./store/authSlice";
import type { AppDispatch, RootState } from "./store";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Auto-fetch user info if token exists
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);
  return (
    <BannedCheckWrapper>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <ScrollToTop />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingPage />} />
            <Route path="/posts" element={<ListingPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/properties/:id" element={<PostDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route
              path="/add-post"
              element={
                <ProtectedRoute>
                  <AddPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-post/:id"
              element={
                <ProtectedRoute>
                  <AddPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-posts"
              element={
                <ProtectedRoute>
                  <MyPostsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="/agent/login" element={<AgentLoginPage />} />
            <Route path="/agent" element={<AgentPage />} />
          </Routes>
        </main>

        <ToastContainer position="top-right" />

        <Footer />
      </div>
    </BannedCheckWrapper>
  );
};

export default App;
