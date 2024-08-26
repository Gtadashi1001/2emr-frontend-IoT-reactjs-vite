// src/components/Toast.jsx
import React from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const Toast = ({ message, onClose, type }) => {
  if (!message) return null;

  // Define as classes de fundo e ícones baseados no tipo de toast
  const toastClasses = {
    success: 'bg-green-100 text-green-500',
    error: 'bg-red-100 text-red-500',
    warning: 'bg-orange-100 text-orange-500',
  };

  const iconClasses = {
    success: <CheckCircleIcon width={20} height={20} aria-hidden="true" />, // Ajusta o tamanho com width e height
    error: <XMarkIcon width={20} height={20} aria-hidden="true" />, // Ajusta o tamanho com width e height
    warning: <ExclamationCircleIcon width={20} height={20} aria-hidden="true" />, // Ajusta o tamanho com width e height
  };

  const toastClass = toastClasses[type] || 'bg-gray-100 text-gray-500';
  const icon = iconClasses[type] || null;

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow ${toastClass}`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${toastClass}`}>
        {icon}
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XMarkIcon width={16} height={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Toast;