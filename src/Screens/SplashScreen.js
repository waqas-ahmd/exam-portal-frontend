import React from "react";
import Animation from "../Components/Animation/Animation";

const SplashScreen = () => {
  return (
    <div style={{ height: "100vh", background: "#225" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ color: "yellow", fontWeight: 600, fontSize: 40 }}>
            EXAM
          </div>
          <div
            style={{
              color: "white",
              fontSize: 40,
              transform: "translateY(-17px)",
              letterSpacing: 3,
            }}
          >
            PORTAL
          </div>
        </div>
        <Animation />
      </div>
    </div>
  );
};

export default SplashScreen;
