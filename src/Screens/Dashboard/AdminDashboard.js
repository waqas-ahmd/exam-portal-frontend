import React from "react";
import LinkContainer from "../../Components/LinkContainer";
import RoundButton from "../../Components/RoundButton";

const AdminDashboard = () => {
  return (
    <div className="fcsc flex1">
      <div className="p-text" style={{ marginBottom: 30, marginTop: 30 }}>
        <h2>DASHBOARD</h2>
      </div>
      <div>
        <LinkContainer to="/teachers">
          <RoundButton style={{ width: 300, marginBottom: 10 }}>
            Teachers
          </RoundButton>
        </LinkContainer>
        <LinkContainer to="/students">
          <RoundButton style={{ width: 300, marginBottom: 10 }}>
            Students
          </RoundButton>
        </LinkContainer>
        <LinkContainer to="/chat">
          <RoundButton style={{ width: 300, marginBottom: 10 }}>
            Messages
          </RoundButton>
        </LinkContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
