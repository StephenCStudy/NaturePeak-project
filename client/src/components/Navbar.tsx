import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-100 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Home
            </Link>
          <Link
            to="/posts"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Listings
          </Link>
            <Link
              to="/add-post"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Add Post
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Link to="/login" className="text-sm text-gray-600 hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:underline"
            >
              Register
            </Link>
            <Link
              to="/admin"
              className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
