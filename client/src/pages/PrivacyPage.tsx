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
        <div className="mt-8 space-y-6 text-[#134e4a]">
          <h2 className="text-2xl font-semibold text-[#083344]">
            Dữ liệu chúng tôi thu thập
          </h2>
          <ul className="list-decimal pl-6 space-y-2">
            <li>Thông tin cá nhân: tên, email, điện thoại, địa chỉ liên hệ.</li>
            <li>
              Thông tin bất động sản: mô tả, ảnh, vị trí, giá, diện tích, giấy
              tờ liên quan.
            </li>
            <li>
              Dữ liệu giao dịch: lịch sử liên hệ, thoả thuận, thông tin thanh
              toán nếu phát sinh.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Mục đích sử dụng
          </h2>
          <p>
            Chúng tôi sử dụng dữ liệu để: kết nối người mua và người bán, hiển
            thị và quản lý tin đăng, hỗ trợ giao dịch, gửi thông báo liên quan
            đến giao dịch và cải thiện trải nghiệm người dùng (gợi ý, thống kê).
          </p>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Chia sẻ với bên thứ ba
          </h2>
          <p>
            Dữ liệu có thể được chia sẻ với các bên cung cấp dịch vụ hỗ trợ giao
            dịch (ví dụ: môi giới, bên xử lý thanh toán, dịch vụ định giá) hoặc
            khi có yêu cầu pháp lý hợp lệ. Chúng tôi yêu cầu các bên này bảo vệ
            dữ liệu theo tiêu chuẩn tương đương.
          </p>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Quyền của người dùng
          </h2>
          <p>
            Người dùng có quyền truy cập, sửa đổi, yêu cầu xóa hoặc hạn chế xử
            lý dữ liệu cá nhân. Để thực hiện quyền này, vui lòng liên hệ bộ phận
            hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
