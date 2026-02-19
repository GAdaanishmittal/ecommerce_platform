import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="status-box mb-4">
      ERROR: {message}
    </div>
  );
};

export default ErrorMessage;
