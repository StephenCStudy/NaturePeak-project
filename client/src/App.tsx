import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import PostDetailPage from "./pages/PostDetailPage";
import AddPostPage from "./pages/AddPostPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import MyPostsPage from "./pages/MyPostsPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditPostPage from "./pages/EditPostPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SupportPage from "./pages/SupportPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <Navbar />

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
            path="/my-posts"
            element={
              <ProtectedRoute>
                <MyPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPostPage />
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
        </Routes>
      </main>

      <ToastContainer position="top-right" />

      <Footer />
    </div>
  );
};

export default App;
