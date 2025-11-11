import React from "react";

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-4">
          Hỗ trợ khách hàng
        </h1>
        <p className="text-[#134e4a] mb-6">
          Cần hỗ trợ? Hãy liên hệ với chúng tôi qua các kênh dưới đây. Đội ngũ
          NaturePeak luôn sẵn sàng.
        </p>
        <div className="space-y-2 text-[#134e4a]">
          <p>
            Email:{" "}
            <a
              className="text-(--color-primary) hover:underline"
              href="mailto:support@realestatepro.local"
            >
              support@realestatepro.local
            </a>
          </p>
          <p>
            Hotline:{" "}
            <strong className="text-(--color-primary)">0123-456-789</strong>{" "}
            (8:00 - 18:00)
          </p>
        </div>
        <div className="mt-8 space-y-6 text-[#134e4a]">
          <h2 className="text-2xl font-semibold text-[#083344]">
            Hướng dẫn cho người bán
          </h2>
          <ul className="list-decimal pl-6 space-y-2">
            <li>
              Chuẩn bị hình ảnh chất lượng cao, mô tả chi tiết và giấy tờ pháp
              lý liên quan.
            </li>
            <li>
              Ghi rõ giá, diện tích, hướng, năm xây dựng và tình trạng sử dụng
              để giúp người mua quyết định nhanh chóng.
            </li>
            <li>
              Luôn cập nhật trạng thái tin (ví dụ: đã bán, đã cho thuê) để tránh
              gây phiền hà cho người quan tâm.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Hướng dẫn cho người mua
          </h2>
          <ul className="list-decimal pl-6 space-y-2">
            <li>
              Kiểm tra hồ sơ pháp lý và xác minh quyền sở hữu trước khi đặt cọc.
            </li>
            <li>
              Sắp xếp lịch hẹn xem thực tế và cân nhắc thuê chuyên gia thẩm định
              nếu cần.
            </li>
            <li>
              Không chuyển tiền cho bên thứ ba nếu chưa có hợp đồng và chứng từ
              rõ ràng.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Báo cáo gian lận / tin không hợp lệ
          </h2>
          <p>
            Nếu bạn nghi ngờ một tin đăng gian lận hoặc bị lừa đảo, hãy cung cấp
            cho chúng tôi: link tin, tên người bán, số điện thoại/email, và các
            bằng chứng (hình ảnh, tin nhắn). Chúng tôi sẽ kiểm tra và có thể tạm
            khoá/ gỡ tin trong khi điều tra.
          </p>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Các giấy tờ thường cần khi đăng/kiểm tra
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sổ đỏ / sổ hồng hoặc hợp đồng chuyển nhượng hợp lệ.</li>
            <li>
              CMND/CCCD hoặc giấy tờ đại diện nếu giao dịch thông qua bên thứ
              ba.
            </li>
            <li>
              Giấy tờ chứng minh nguồn gốc tài sản nếu có yêu cầu kiểm chứng.
            </li>
          </ul>

          <p>
            Nếu cần hỗ trợ khẩn cấp liên quan đến an toàn giao dịch, vui lòng
            gọi hotline; với các yêu cầu khác, gửi email kèm thông tin chi tiết
            để chúng tôi xử lý nhanh nhất có thể.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
