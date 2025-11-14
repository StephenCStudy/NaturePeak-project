import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHome, HiOutlineSparkles } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logoutUser } from "../store/authSlice";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const role = useSelector((s: RootState) => s.auth.role);
  const token = useSelector((s: RootState) => s.auth.token);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-(--color-cream) backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg shadow-soft bg-(--color-pastel) text-(--color-primary) font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-(--color-primary) group-hover:text-white">
              <HiOutlineHome
                size={22}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
            </div>
            <div className="transition-all duration-300">
              <div className="text-lg font-heading text-[#083344] group-hover:text-(--color-primary) transition-colors duration-300">
                NaturePeak
              </div>
              <div className="text-xs text-muted hidden sm:block group-hover:text-[#083344] transition-colors duration-300">
                An cư giữa thiên nhiên – đón nhịp sống an lành nơi vùng ven
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-[#134e4a]">
          <Link
            to="/"
            className="relative px-2 py-1 transition-all duration-300 hover:text-(--color-primary) after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-(--color-primary) after:transition-all after:duration-300 hover:after:w-full"
          >
            Trang chủ
          </Link>
          <Link
            to="/posts"
            className="relative px-2 py-1 transition-all duration-300 hover:text-(--color-primary) after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-(--color-primary) after:transition-all after:duration-300 hover:after:w-full"
          >
            Tin rao
          </Link>
          <Link
            to="/agent/login"
            className="px-3 py-2 text-sm font-medium text-[#134e4a] rounded-lg hidden sm:inline transition-all duration-300 hover:bg-(--color-pastel) hover:text-(--color-primary) hover:shadow-md hover:scale-105"
          >
            Đại lý
          </Link>
          {role === "admin" && (
            <Link
              to="/admin"
              className="px-3 py-2 text-sm font-medium text-[#134e4a] border border-gray-200 rounded-lg hidden sm:inline transition-all duration-300 hover:bg-(--color-primary) hover:text-white hover:border-(--color-primary) hover:shadow-lg hover:scale-105"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {/* If user is authenticated (token present), show Đăng xuất, otherwise show Đăng nhập / Đăng ký */}
          {token ? (
            <>
              <Link
                to="/profile"
                className="text-(--color-primary) mr-2 p-2 rounded-full transition-all duration-300 hover:bg-(--color-pastel) hover:scale-110 hover:shadow-md"
              >
                <FaUser size={18} />
              </Link>
              <button
                onClick={async () => {
                  if (isLoggingOut) return;

                  setIsLoggingOut(true);
                  try {
                    const resultAction = await dispatch(logoutUser());

                    if (logoutUser.fulfilled.match(resultAction)) {
                      toast.success("Đăng xuất thành công!");
                      navigate("/");
                    }
                  } catch (error) {
                    toast.error("Có lỗi xảy ra khi đăng xuất");
                  } finally {
                    setIsLoggingOut(false);
                  }
                }}
                disabled={isLoggingOut}
                className="text-sm text-muted hidden sm:inline transition-all duration-300 hover:text-red-500 hover:scale-105 disabled:opacity-50 px-3 py-1 rounded-lg hover:bg-red-50"
              >
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted hidden sm:inline px-3 py-2 rounded-lg transition-all duration-300 hover:text-(--color-primary) hover:bg-(--color-pastel) hover:scale-105"
              >
                Đăng nhập
              </Link>
              <span className="hidden sm:inline text-muted">/</span>
              <Link
                to="/register"
                className="text-sm text-muted hidden sm:inline px-3 py-2 rounded-lg transition-all duration-300 hover:text-(--color-primary) hover:bg-(--color-pastel) hover:scale-105"
              >
                Đăng ký
              </Link>
            </>
          )}

          <Link
            to="/add-post"
            className="btn-accent hidden sm:inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 group"
          >
            <HiOutlineSparkles className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="text-sm font-semibold">Đăng tin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
