import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        <div>
          © {new Date().getFullYear()} RealEstatePro. All rights reserved.
        </div>
        <div className="mt-2 sm:mt-0">
          Built with ♥ — Contact: support@realestatepro.local
        </div>
      </div>
    </footer>
  );
};

export default Footer;
