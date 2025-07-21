import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthStatus from "../AuthStatus";
import { useAppDispatch } from "../../hooks/redux";
import { generalAPI } from "../../services/apiService";
import { useSelector } from "react-redux";

const Header = () => {
  const dispatch = useAppDispatch();
  const [navItems, setNavItems] = useState([
    { label: "Trang chủ", link: "/" },
    { label: "Giá cả", link: "/price" },
  ]);

  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const userData = await dispatch(generalAPI.getCurrentUser());
        const role = userData?.result?.role;
        if (role === "ADMIN") {
          setNavItems([
            { label: "Trang chủ", link: "/" },
            { label: "Dashboard", link: "/dashboard-admin" },
            { label: "Quản lý người dùng", link: "/manage-user" },
          ]);
        } else {
          setNavItems([
            { label: "Trang chủ", link: "/" },
            { label: "Giá cả", link: "/price" },
          ]);
        }
      } catch (e) {
        setNavItems([
          { label: "Trang chủ", link: "/" },
          { label: "Giá cả", link: "/price" },
        ]);
      }
    };
    fetchUser();
  }, [token, dispatch]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[60] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="!no-underline flex items-center gap-x-2">
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
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="!no-underline text-[17px] font-medium text-purple-700 hover:text-purple-700 transition-colors duration-200"
              >
                <div className="text-purple-700 hover:text-purple-700">
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-x-4">
            <AuthStatus />
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
            <Link
              key={index}
              to={item.link}
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-gray-200">
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
