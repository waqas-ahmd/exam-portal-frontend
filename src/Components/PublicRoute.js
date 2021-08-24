import React from "react";
import { Route } from "react-router-dom";
import Layout from "./Layout";

const PublicRoute = ({ path, element }) => {
  return (
    <Layout>
      <Route path={path} element={element} />
    </Layout>
  );
};

export default PublicRoute;
