import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-4">
          Điều khoản sử dụng
        </h1>
        <p className="text-[#134e4a] mb-6">
          Bằng việc sử dụng NaturePeak, bạn đồng ý tuân thủ các điều khoản và
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
        <div className="mt-8 space-y-6 text-[#134e4a]">
          <h2 className="text-2xl font-semibold text-[#083344]">
            Quy định đăng tin mua/bán
          </h2>
          <ul className="list-decimal pl-6 space-y-2">
            <li>
              Tin đăng phải cung cấp thông tin chính xác về vị trí, diện tích,
              giá và tình trạng pháp lý của bất động sản. Mô tả và hình ảnh phải
              phản ánh trung thực thực tế.
            </li>
            <li>
              Người đăng chịu trách nhiệm cung cấp giấy tờ, chứng từ liên quan
              khi có yêu cầu từ người mua hoặc cơ quan chức năng.
            </li>
            <li>
              Không được đăng tin nhằm lừa đảo, khai thác thông tin cá nhân,
              hoặc quảng cáo dịch vụ bất hợp pháp. Các hành vi gian lận sẽ dẫn
              đến khoá tài khoản và thông báo cho cơ quan chức năng khi cần
              thiết.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Quy trình giao dịch
          </h2>
          <p>
            NaturePeak là nền tảng kết nối người mua, người bán và môi giới. Mọi
            giao dịch thực tế (thương lượng, ký hợp đồng, thanh toán, sang tên)
            được thực hiện trực tiếp giữa các bên. Chúng tôi khuyến nghị người
            dùng xác minh giấy tờ pháp lý, kiểm tra hiện trạng và ưu tiên ký hợp
            đồng bằng văn bản khi giao dịch lớn.
          </p>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Phí, hoa hồng và điều kiện
          </h2>
          <p>
            Các điều khoản phí và hoa hồng (nếu có) do bên bán và môi giới thống
            nhất. NaturePeak không trực tiếp can thiệp vào khoản thanh toán giữa
            các bên, trừ khi có dịch vụ xử lý giao dịch được thỏa thuận riêng.
          </p>

          <h2 className="text-2xl font-semibold text-[#083344]">
            Tranh chấp và khiếu nại
          </h2>
          <p>
            Trong trường hợp tranh chấp liên quan đến tin đăng hoặc giao dịch,
            người dùng có thể liên hệ bộ phận hỗ trợ để báo cáo. Chúng tôi sẽ
            xem xét và hỗ trợ trung gian khi có đủ thông tin; tuy nhiên nền tảng
            không thay thế vai trò pháp lý của các cơ quan chức năng hoặc trọng
            tài thương mại.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
