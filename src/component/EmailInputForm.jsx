import React, { useState } from "react";

const EmailInputForm = ({
  onSubmit,
  buttonText = "Gửi mã OTP",
  loading = false,
  error = "",
  defaultEmail = "",
  disabled = false,
}) => {
  const [email, setEmail] = useState(defaultEmail);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={disabled || loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="you@example.com"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {loading ? "Đang gửi..." : buttonText}
      </button>
    </form>
  );
};

export default EmailInputForm;
