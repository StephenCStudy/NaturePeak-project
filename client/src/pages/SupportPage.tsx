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
          RealEstatePro luôn sẵn sàng.
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
      </div>
    </div>
  );
};

export default SupportPage;
