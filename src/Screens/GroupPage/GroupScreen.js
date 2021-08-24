import React from "react";
import { useSelector } from "react-redux";
import StudentGroup from "./StudentGroup";
import TeacherGroup from "./TeacherGroup";

const GroupScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  if (userData) {
    if (userData.role === "Teacher") {
      return <TeacherGroup />;
    }
    if (userData.role === "Student") {
      return <StudentGroup />;
    }
  } else {
    return <div></div>;
  }
};

export default GroupScreen;
