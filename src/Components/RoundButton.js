import React from "react";

const RoundButton = ({ children, onClick, style, className }) => {
  return (
    <div
      style={{ ...style }}
      onClick={onClick}
      className={`round-btn ${className}`}
    >
      {children}
    </div>
  );
};

export default RoundButton;
