import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 flex items-start gap-3 animate-slideDown">
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="flex-grow">
        <p className="text-red-800 font-medium text-sm sm:text-base">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors p-1 -mt-1 -mr-1 touch-manipulation"
        aria-label="Dismiss error"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ErrorMessage;
