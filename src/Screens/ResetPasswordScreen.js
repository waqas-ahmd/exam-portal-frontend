import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Loader from "../Components/Loader";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";
import { resetPassword } from "../Store/Actions/UserActions";
import { dontMatch, isEmpty } from "../utils/validation";

const ResetPasswordScreen = () => {
  const formErrorsInitial = {
    password: false,
    confirmPassword: false,
  };
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState(formErrorsInitial);
  const [forceValidation, setForceValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const resetPasswordHandler = async () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }
    setSuccess(false);
    setError(false);
    setLoading(true);
    try {
      const data = await dispatch(resetPassword(password));
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    let newFormErrors = formErrorsInitial;
    let formError = true;

    if (dontMatch(password, confirmPassword)) {
      newFormErrors.confirmPassword = "Passwords do not Match";
      formError = false;
    }
    if (isEmpty(password)) {
      newFormErrors.password = "REQUIRED";
      formError = false;
    }
    if (isEmpty(confirmPassword)) {
      newFormErrors.confirmPassword = "REQUIRED";
      formError = false;
    }

    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword, password]);

  return (
    <div className="t-ctr flex1 fccc">
      <h2 className="p-text my-3 py-3">RESET PASSWORD</h2>
      <div>
        <RoundInput
          validation={{ force: forceValidation, value: formErrors.password }}
          style={{ width: 400, marginBottom: 10 }}
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </RoundInput>
        <RoundInput
          validation={{
            force: forceValidation,
            value: formErrors.confirmPassword,
          }}
          style={{ width: 400, marginBottom: 10 }}
        >
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
          />
        </RoundInput>
        <RoundButton onClick={resetPasswordHandler}>Reset Password</RoundButton>
      </div>
      {error ? <div className="mt-3 p-text">{error}</div> : null}
      {loading && <Loader msg="Please Wait" />}
      {success && <div className="p-text">Password Changed Successfully</div>}
    </div>
  );
};

export default ResetPasswordScreen;
