import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineHome, HiOutlineSparkles } from "react-icons/hi";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-(--color-cream) backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg shadow-soft bg-(--color-pastel) text-(--color-primary) font-bold">
              <HiOutlineHome size={22} />
            </div>
            <div>
              <div className="text-lg font-heading text-[#083344]">
                RealEstatePro
              </div>
              <div className="text-xs text-muted hidden sm:block">
                Tự nhiên — Đất đai, vùng ven
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-[#134e4a]">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          <Link to="/posts" className="hover:underline">
            Tin rao
          </Link>
          <Link to="/admin" className="hover:underline">
            Dành cho môi giới
          </Link>
          <Link to="/contact" className="hover:underline">
            Liên hệ
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted hidden sm:inline">
            Đăng nhập
          </Link>

          <Link
            to="/add-post"
            className="btn-accent hidden sm:inline-flex items-center gap-2"
          >
            <HiOutlineSparkles />
            <span className="text-sm font-semibold">Đăng tin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

