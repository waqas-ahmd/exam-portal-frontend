import React from "react";

const Divider = ({ style }) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #888",
        width: "100%",
        margin: "10px auto",
        ...style,
      }}
    ></div>
  );
};

export default Divider;
