
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-slate-800">{title}</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
