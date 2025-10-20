import React from 'react';
import './FormGroup.css';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = '',
  error = false,
  errorMessage
}) => {
  return (
    <div className={`form-group ${className}`}>
      {children}
      {error && errorMessage && (
        <div className="form-group-error">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FormGroup;
