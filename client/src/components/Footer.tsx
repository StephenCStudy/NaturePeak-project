import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookSquare, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="mt-12 bg-(--color-cream) text-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-heading text-xl text-[#083344]">NaturePeak</h4>
          <p className="text-sm text-muted mt-2">
            Sàn giao dịch bất động sản vùng ven — Thân thiện, tin cậy, minh
            bạch.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-(--color-primary) hover:opacity-80"
              aria-label="Facebook"
            >
              <FaFacebookSquare size={22} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-(--color-primary) hover:opacity-80"
              aria-label="YouTube"
            >
              <FaYoutube size={22} />
            </a>
            <a
              href="mailto:support@realestatepro.local"
              className="text-(--color-primary) hover:opacity-80"
              aria-label="Email"
            >
              <FaEnvelope size={22} />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-[#083344]">Chính sách</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate("/terms")}
                className="hover:underline text-[#134e4a]"
              >
                Điều khoản sử dụng
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/privacy")}
                className="hover:underline text-[#134e4a]"
              >
                Chính sách bảo mật
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/support")}
                className="hover:underline text-[#134e4a]"
              >
                Hỗ trợ khách hàng
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-[#083344]">Liên hệ</h5>
          <p className="mt-3 text-sm text-[#134e4a]">
            Hotline:{" "}
            <strong className="text-(--color-primary)">0123-456-789</strong>
          </p>
          <p className="text-sm text-[#134e4a]">
            Email:{" "}
            <a
              href="mailto:support@realestatepro.local"
              className="hover:underline"
            >
              support@realestatepro.local
            </a>
          </p>
        </div>
      </div>

      <div className="border-t-2 border-(--color-pastel) py-3 text-center text-sm text-[#134e4a] bg-white/40">
        © {new Date().getFullYear()} NaturePeak — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
