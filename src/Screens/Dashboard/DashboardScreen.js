import React from "react";
import { useSelector } from "react-redux";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

const DashboardScreen = () => {
  const userData = useSelector((state) => state.users.userData);
  if (userData) {
    if (userData.role === "Teacher") {
      return <TeacherDashboard />;
    }
    if (userData.role === "Student") {
      return <StudentDashboard />;
    }
    if (userData.role === "Admin") {
      return <AdminDashboard />;
    }
  } else {
    return <div></div>;
  }
};

export default DashboardScreen;
