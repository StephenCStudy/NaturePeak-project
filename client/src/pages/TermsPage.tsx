import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-4">
          Điều khoản sử dụng
        </h1>
        <p className="text-[#134e4a] mb-6">
          Bằng việc sử dụng RealEstatePro, bạn đồng ý tuân thủ các điều khoản và
          quy định sau đây nhằm đảm bảo trải nghiệm an toàn và minh bạch cho tất
          cả người dùng.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#134e4a]">
          <li>Không đăng tải nội dung sai sự thật hoặc vi phạm pháp luật.</li>
          <li>
            Chịu trách nhiệm về nội dung, hình ảnh và thông tin liên hệ của bạn.
          </li>
          <li>Tôn trọng quyền riêng tư và thông tin cá nhân của người khác.</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsPage;
