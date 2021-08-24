import React, { useRef, useState } from "react";
import { Overlay } from "react-bootstrap";

const NavIcon = ({ children, tip }) => {
  const [showTip, setShowTip] = useState(false);
  const target = useRef(null);

  return (
    <div
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      ref={target}
    >
      {children}
      <Overlay target={target.current} show={showTip} placement="bottom">
        {(props) => (
          <div
            {...props}
            style={{
              backgroundColor: "#000011ea",
              padding: "2px 5px",
              color: "white",
              borderRadius: 2,
              marginTop: 5,
              fontSize: "small",
              zIndex: 100000,
              ...props.style,
            }}
          >
            {tip}
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default NavIcon;
