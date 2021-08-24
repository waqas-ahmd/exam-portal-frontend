import React from "react";
import { useSelector } from "react-redux";
import StudentGroupList from "./StudentGroupList";
import TeacherGroupList from "./TeacherGroupList";

const GroupListScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  if (userData) {
    if (userData.role === "Teacher") {
      return <TeacherGroupList />;
    }
    if (userData.role === "Student") {
      return <StudentGroupList />;
    }
  } else {
    return <div></div>;
  }
};

export default GroupListScreen;
