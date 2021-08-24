import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router";
import Layout from "./Layout";

const AdminRoute = ({ path, element }) => {
  const userData = useSelector((state) => state.users.userData) || "notfound";
  const navigate = useNavigate();
  useEffect(() => {
    if (userData === "notfound") {
      navigate("/");
    } else if (userData.role !== "Admin") {
      navigate("/");
    }
  }, [navigate, userData]);
  return (
    <Layout>
      <Route path={path} element={element} />
    </Layout>
  );
};

export default AdminRoute;
