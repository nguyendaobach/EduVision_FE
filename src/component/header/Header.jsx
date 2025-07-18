import { useState } from "react";
import { Link } from "react-router-dom";
import AuthStatus from "../AuthStatus";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  const navItems = [
    { label: "Trang chủ", link: "/" },
    { label: "Giá cả", link: "/price" },
    { label: "Giới thiệu", link: "/about" },
  ];
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[60] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="!no-underline">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900 no-underline">
                  EduVision
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation Menu */}

          <nav className="hidden md:flex items-center space-x-8 justify-start mr-80 ">
            {" "}
            {navItems.map((item, index) => (
              <div key={index} className="relative">
                {item.link ? (
                  <Link to={item.link} className="!no-underline">
                    <span className="flex text-[17px] items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2  font-medium transition-colors duration-200">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <div
                    onClick={() =>
                      item.hasDropdown && toggleDropdown(item.label)
                    }
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 px-3 py-2 text-[17px] font-medium transition-colors duration-200"
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            ))}{" "}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <div className="">
              <AuthStatus />
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-200">
            {/* Thay nút Đăng nhập bằng AuthStatus cho mobile */}
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
