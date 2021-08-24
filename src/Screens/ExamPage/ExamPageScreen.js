import React from "react";
import { useSelector } from "react-redux";
import StudentExamPage from "./StudentExamPage";
import TeacherExamPage from "./TeacherExamPage";

const ExamPageScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  if (userData) {
    if (userData.role === "Teacher") {
      return <TeacherExamPage />;
    }
    if (userData.role === "Student") {
      return <StudentExamPage />;
    }
  } else {
    return <div></div>;
  }
};

export default ExamPageScreen;
