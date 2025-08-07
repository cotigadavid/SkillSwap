import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, X } from "lucide-react";

const PasswordInput = ({ value, onChange, showPassword, toggleShowPassword }) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        required
        placeholder="Password"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
      />
      <button
        type="button"
        onClick={toggleShowPassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;