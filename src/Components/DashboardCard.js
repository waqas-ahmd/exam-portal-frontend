import React from "react";

const DashboardCard = ({ children, style }) => {
  return (
    <div
      className="dashboard-card"
      style={{
        width: "100%",
        background: "white",
        boxShadow: "0px 2px 2px #0004",
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default DashboardCard;
