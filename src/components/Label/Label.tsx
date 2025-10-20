import React from 'react';
import './Label.css';

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({ 
  htmlFor, 
  children, 
  className = '', 
  required = false 
}) => {
  return (
    <label 
      htmlFor={htmlFor} 
      className={`label ${className}`}
    >
      {children}
      {required && <span className="required-asterisk"> *</span>}
    </label>
  );
};

export default Label;
