import React from "react";

const ProfileDataCard = ({ title, value }) => {
  return (
    <div
      className="profile-data-card"
      style={{
        background: "white",
        padding: "10px 20px",
        boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.25)",
        borderRadius: 3,
        position: "relative",
        width: 400,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontSize: "smaller",
          width: "25%",
        }}
      >
        {title}
      </div>
      <div style={{ fontWeight: "bold" }}>{value}</div>
    </div>
  );
};

export default ProfileDataCard;
