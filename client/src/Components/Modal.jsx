import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/30 transition-all duration-300 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="relative min-h-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-6 w-full max-w-lg -mt-[90px] transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;