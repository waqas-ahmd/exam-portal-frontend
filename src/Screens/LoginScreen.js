import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse } from "query-string";
import LinkContainer from "../Components/LinkContainer";
import RoundInput from "../Components/RoundInput";
import RoundButton from "../Components/RoundButton";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginUserWithGoogle } from "../Store/Actions/UserActions";
import { invalidEmail, isEmpty } from "../utils/validation";
import { Button, Modal, Spinner } from "react-bootstrap";
import { MdError } from "react-icons/md";
import { GoogleLogin } from "react-google-login";

const LoginScreen = () => {
  const formErrorsInitial = {
    email: false,
    password: false,
  };
  const location = useLocation();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState(formErrorsInitial);
  const [forceValidation, setForceValidation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users.userData);
  const navigate = useNavigate();

  const closeModal = () => {
    setShowModal(false);
    setError(false);
    setLoading(false);
  };

  const onGoogleLoginSuccess = async (res) => {
    setLoading(true);
    setShowModal(true);
    try {
      const data = await dispatch(
        loginUserWithGoogle({ token: res.tokenId, role })
      );
      if (data.error) {
        setError(data.error);
      } else {
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };

  const onGoogleLoginFail = (res) => {
    console.log(res);
  };

  const submitHandler = async () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }
    setLoading(true);
    setShowModal(true);
    try {
      const data = await dispatch(
        loginUser({
          email,
          password,
          role,
        })
      );
      if (data.error) {
        setError(data.error);
      } else {
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (userData) {
      navigate("/dashboard");
    }
  }, [userData, navigate]);

  useEffect(() => {
    setRole(parse(location.search)["role"]);
  }, [location]);

  useEffect(() => {
    let newFormErrors = formErrorsInitial;
    let formError = true;

    if (invalidEmail(email)) {
      newFormErrors.email = "Invalid Email";
      formError = false;
    }
    if (isEmpty(email)) {
      newFormErrors.email = "REQUIRED";
      formError = false;
    }
    if (isEmpty(password)) {
      newFormErrors.password = "REQUIRED";
      formError = false;
    }

    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  return (
    <div className="fccc flex1 t-ctr">
      {/* Modal Showing the Loading and Errors */}
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <div
          className="fccc"
          style={{
            height: "50vh",
          }}
        >
          {loading ? (
            <>
              <Spinner animation="border" role="status"></Spinner>
              <h3>Signing in as {role}</h3>
            </>
          ) : null}
          {error ? (
            <>
              <MdError color="red" size={40} />{" "}
              <span className="modal-error">{error}</span>
            </>
          ) : null}
        </div>
        {error ? (
          <Modal.Footer>
            <div className="frcc w-100">
              <Button block onClick={closeModal}>
                OK
              </Button>

              <Button
                className="mt-0 ml-1"
                block
                onClick={() => navigate(`/register?role=${role}`)}
              >
                Create New Account
              </Button>
            </div>
          </Modal.Footer>
        ) : null}
      </Modal>
      <div>
        <h3 className="p-text" style={{ fontWeight: "bold" }}>
          Login as a {role}
        </h3>
        <div className="p-text frcc">
          Don't have an Account?{"  "}
          <LinkContainer
            className="ml-2 t-bold"
            // style={{ fontWeight: "bold", marginLeft: 10 }}
            to={`/register?role=${role}`}
          >
            Create Account
          </LinkContainer>
        </div>
      </div>
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <RoundInput
          validation={{
            force: forceValidation,
            value: formErrors.email,
          }}
          style={{ width: 300, marginBottom: 10 }}
        >
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </RoundInput>
        <RoundInput
          validation={{
            force: forceValidation,
            value: formErrors.password,
          }}
          style={{ width: 300, marginBottom: 10 }}
        >
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </RoundInput>
      </div>

      <div>
        <RoundButton
          style={{ width: 240, marginBottom: 10 }}
          onClick={submitHandler}
        >
          Sign In
        </RoundButton>
        <GoogleLogin
          clientId={`348194406885-20tf3nt83ug1hmi238skdi060gua18p2.apps.googleusercontent.com`}
          render={(renderProps) => (
            <RoundButton
              className="frcc mb-2"
              style={{
                width: 240,
              }}
              onClick={renderProps.onClick}
            >
              <FcGoogle size={24} />
              <span className="ml-2">Sign In with Google</span>
            </RoundButton>
          )}
          disabled={false}
          onSuccess={onGoogleLoginSuccess}
          onFailure={onGoogleLoginFail}
          cookiePolicy={`single_host_origin`}
          // isSignedIn={true}
        />
      </div>
      <div className="p-text frcc my-3">
        Forgot Password?{" "}
        <LinkContainer
          style={{ fontWeight: "bold", marginLeft: 10 }}
          to="/forget"
        >
          Reset Password
        </LinkContainer>
      </div>
      <div>
        <LinkContainer to={`/tutorial/${role}`}>
          <Button>See Tutorial</Button>
        </LinkContainer>
      </div>
    </div>
  );
};

export default LoginScreen;
