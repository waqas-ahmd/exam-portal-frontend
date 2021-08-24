import React, { useRef, useState } from "react";
import { Overlay } from "react-bootstrap";
import { FiAlertCircle } from "react-icons/fi";

const RoundInput = ({ children, style, validation, className }) => {
  const [focused, setFocused] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const target = useRef(null);
  const value = validation ? validation.value : null;
  const force = validation ? validation.force : null;

  return (
    <>
      <div
        onFocus={() => setFocused(true)}
        style={{ ...style, position: "relative" }}
        className={`round-input ${className}`}
      >
        {children}

        {value && (force || focused) ? (
          <div
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            ref={target}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: 9,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ff2200ea",
              zIndex: 10000,
            }}
          >
            <FiAlertCircle size={20} />
            <Overlay target={target.current} show={showTip} placement="top">
              {(props) => (
                <div
                  {...props}
                  style={{
                    backgroundColor: "#ff2200ea",
                    padding: "2px 5px",
                    color: "white",
                    borderRadius: 2,
                    marginBottom: 3,
                    fontSize: "small",
                    zIndex: 100000,
                    ...props.style,
                  }}
                >
                  {value}
                </div>
              )}
            </Overlay>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default RoundInput;
