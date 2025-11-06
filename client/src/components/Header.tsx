import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded">
            RP
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              RealEstatePro
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              Find your next home
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-600 hidden sm:block">
          Hotline: <strong>0123-456-789</strong>
        </div>
      </div>
    </header>
  );
};

export default Header;
