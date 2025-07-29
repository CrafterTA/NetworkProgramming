import React from 'react';

const Button = ({ children, className = '', onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      className={`
        py-3 px-6 rounded-lg
        bg-primary text-white font-medium text-base
        flex items-center justify-center gap-2
        outline-none border-none cursor-pointer
        transition-all duration-300 ease-in-out
        hover:opacity-80
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;