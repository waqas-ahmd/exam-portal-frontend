import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ msg }) => {
  return (
    <div
      className="p-text"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Spinner size="sm" animation="border" />
      <div> {msg}</div>
    </div>
  );
};

export default Loader;
