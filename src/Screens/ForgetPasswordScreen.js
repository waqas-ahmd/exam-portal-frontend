import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../Components/Loader";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";
import { forgetPassword } from "../Store/Actions/UserActions";

const ForgetPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();
  const sendEmail = async () => {
    setSuccess(false);
    setError(null);
    setLoading(true);
    const data = await dispatch(forgetPassword(email));
    if (!data.error) {
      setEmail("");
    } else {
      setError(data.error);
    }
    setLoading(false);
    setSuccess(true);
  };
  return (
    <div className="fcsc flex1 t-ctr">
      <h2 className="p-text my-3 py-3">RESET PASSWORD</h2>
      <div>
        <RoundInput className="mb-3" style={{ width: 300 }}>
          <input
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </RoundInput>
        <RoundButton onClick={sendEmail}>Reset Password</RoundButton>
      </div>

      {error ? <div className="mt-3">{error}</div> : null}
      {loading && <Loader msg="Please Wait" />}
      {success && (
        <div className="p-text mt-3">
          A link has been sent to your email. Use it to change the password.
        </div>
      )}
    </div>
  );
};

export default ForgetPasswordScreen;
