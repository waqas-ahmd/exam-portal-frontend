import React from "react";
import LinkContainer from "../../Components/LinkContainer";
import RoundButton from "../../Components/RoundButton";

const StudentDashboard = () => {
  return (
    <div className="fcsc flex1">
      <div className="p-text" style={{ marginBottom: 30, marginTop: 30 }}>
        <h2>DASHBOARD</h2>
      </div>
      <div>
        <LinkContainer to="/exams">
          <RoundButton style={{ width: 300, marginBottom: 10 }}>
            Exams List
          </RoundButton>
        </LinkContainer>
        <LinkContainer to="/groups">
          <RoundButton style={{ width: 300, marginBottom: 10 }}>
            Groups
          </RoundButton>
        </LinkContainer>
      </div>
    </div>
  );
};

export default StudentDashboard;
