import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-(--color-brown) text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-heading text-lg">RealEstatePro</h4>
          <p className="text-sm text-gray-200 mt-2">
            Sàn giao dịch bất động sản vùng ven — Thân thiện, tin cậy, minh
            bạch.
          </p>
        </div>

        <div>
          <h5 className="font-semibold">Chính sách</h5>
          <ul className="mt-3 space-y-2 text-sm text-gray-200">
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Hỗ trợ khách hàng</li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold">Liên hệ</h5>
          <p className="mt-3 text-sm text-gray-200">
            Hotline: <strong className="text-yellow-200">0123-456-789</strong>
          </p>
          <p className="text-sm text-gray-200">
            Email: support@realestatepro.local
          </p>
        </div>
      </div>

      <div className="border-t border-black/10 py-3 text-center text-sm text-gray-200 bg-[rgba(0,0,0,0.04)]">
        © {new Date().getFullYear()} RealEstatePro — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

