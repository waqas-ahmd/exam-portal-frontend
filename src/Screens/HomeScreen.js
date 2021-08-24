import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Animation from "../Components/Animation/Animation";
import LinkContainer from "../Components/LinkContainer";
import RoundButton from "../Components/RoundButton";

const HomeScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    } else {
      return;
    }
  }, [userData, navigate]);
  return (
    <div
      style={{
        height: "100vh",
        background: "#225",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
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
            flexDirection: "row",
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
              letterSpacing: 3,
            }}
          >
            PORTAL
          </div>
        </div>
        <Animation />
        <div style={{ padding: 20 }}>
          <LinkContainer
            to="/login?role=Teacher"
            style={{ margin: "auto", marginBottom: 10, width: 240 }}
          >
            <RoundButton style={{ background: "#0003", color: "white" }}>
              Login As a Teacher
            </RoundButton>
          </LinkContainer>
          <LinkContainer
            to="/login?role=Student"
            style={{ margin: "auto", marginBottom: 10, width: 240 }}
          >
            <RoundButton style={{ background: "#0003", color: "white" }}>
              Login As a Student
            </RoundButton>
          </LinkContainer>
        </div>
      </div>
     
    </div>
  );
};

export default HomeScreen;
