import React from "react";
import { useSelector } from "react-redux";
import StudentExamList from "./StudentExamList";
import TeacherExamList from "./TeacherExamList";

const ExamListScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  if (userData) {
    if (userData.role === "Teacher") {
      return <TeacherExamList />;
    }
    if (userData.role === "Student") {
      return <StudentExamList />;
    }
  } else {
    return <div></div>;
  }
};

export default ExamListScreen;
