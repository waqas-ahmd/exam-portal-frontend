import React from "react";
import { useNavigate } from "react-router-dom";

const LinkContainer = ({ children, to, style, className }) => {
  let navigate = useNavigate();
  return (
    <div
      className={className}
      style={{ userSelect: "none", cursor: "pointer", ...style }}
      onClick={() => navigate(to)}
    >
      {children}
    </div>
  );
};

export default LinkContainer;
