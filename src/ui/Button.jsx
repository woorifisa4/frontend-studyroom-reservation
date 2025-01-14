import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', // primary, secondary, or outline
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseStyles = "flex justify-center py-3 px-4 rounded-xl text-sm font-bold transition duration-200 hover:scale-[1.02] active:scale-[0.98]";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
    secondary: "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 shadow-sm",
    outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default Button;
