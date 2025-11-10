import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-4">
          Chính sách bảo mật
        </h1>
        <p className="text-[#134e4a] mb-6">
          Chúng tôi cam kết bảo vệ dữ liệu và quyền riêng tư của người dùng.
          Thông tin cá nhân chỉ được sử dụng cho mục đích hỗ trợ giao dịch và
          nâng cao chất lượng dịch vụ.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#134e4a]">
          <li>Không chia sẻ dữ liệu cá nhân khi chưa có sự đồng ý.</li>
          <li>Mã hoá và lưu trữ dữ liệu theo quy chuẩn.</li>
          <li>
            Cho phép người dùng yêu cầu chỉnh sửa hoặc xoá dữ liệu cá nhân.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPage;
