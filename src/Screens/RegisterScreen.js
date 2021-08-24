import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LinkContainer from "../Components/LinkContainer";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  registerUserWithGoogle,
} from "../Store/Actions/UserActions";
import { dontMatch, invalidEmail, isEmpty } from "../utils/validation";
import { Modal, Spinner, Button } from "react-bootstrap";
import { MdError } from "react-icons/md";
import { GoogleLogin } from "react-google-login";

const RegisterScreen = () => {
  const formErrorsInitial = {
    firstname: false,
    lastname: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false,
    address: false,
  };
  const location = useLocation();
  const [role, setRole] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
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
        registerUserWithGoogle({ token: res.tokenId, role })
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
        registerUser({
          firstname,
          lastname,
          email,
          phone,
          address,
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
    } else {
      return;
    }
  }, [userData, navigate]);

  useEffect(() => {
    setRole(parse(location.search)["role"]);
  }, [location]);

  useEffect(() => {
    let newFormErrors = formErrorsInitial;
    let formError = true;
    if (isEmpty(firstname)) {
      newFormErrors.firstname = "REQUIRED";
      formError = false;
    }
    if (isEmpty(lastname)) {
      newFormErrors.lastname = "REQUIRED";
      formError = false;
    }
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
    if (invalidEmail(email)) {
      newFormErrors.email = "Invalid Email";
      formError = false;
    }
    if (isEmpty(email)) {
      newFormErrors.email = "REQUIRED";
      formError = false;
    }
    if (isEmpty(phone)) {
      newFormErrors.phone = "REQUIRED";
      formError = false;
    }
    if (isEmpty(address)) {
      newFormErrors.address = "REQUIRED";
      formError = false;
    }
    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, confirmPassword, email, firstname, lastname, password, phone]);
  return (
    <div className="register-page t-ctr flex1 fccc">
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
              <h3>Signing up as {role}</h3>
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
            <Button block onClick={closeModal}>
              OK
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>

      {/* Register Page */}
      <div>
        <h3 className="p-text" style={{ fontWeight: "bold" }}>
          Join as a {role}
        </h3>
        <div className="p-text frcc">
          Already have an Account?{"  "}
          <LinkContainer
            style={{ fontWeight: "bold", marginLeft: 10 }}
            to={`/login?role=${role}`}
          >
            Log in
          </LinkContainer>
        </div>
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <form>
          <div
            className="names-inputs"
            style={{
              display: "flex",
              flexDirection: "row",
              width: 400,
              justifyContent: "space-between",
            }}
          >
            <RoundInput
              validation={{
                force: forceValidation,
                value: formErrors.firstname,
              }}
              style={{ marginBottom: 10, width: "49%" }}
            >
              <input
                type="text"
                placeholder="First Name"
                value={firstname}
                onChange={(e) => setFirstname(e.currentTarget.value)}
              />
            </RoundInput>
            <RoundInput
              validation={{
                force: forceValidation,
                value: formErrors.lastname,
              }}
              style={{ marginBottom: 10, width: "49%" }}
            >
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastname(e.currentTarget.value)}
              />
            </RoundInput>
          </div>

          <RoundInput
            validation={{ force: forceValidation, value: formErrors.email }}
            style={{ width: 400, marginBottom: 10 }}
          >
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </RoundInput>
          <RoundInput
            validation={{ force: forceValidation, value: formErrors.phone }}
            style={{ width: 400, marginBottom: 10 }}
          >
            <PhoneInput
              // country="lk"
              className="phoneInput"
              specialLabel={false}
              placeholder="Phone"
              value={phone}
              onChange={(p) => setPhone(p)}
            />
          </RoundInput>
          <RoundInput
            validation={{ force: forceValidation, value: formErrors.address }}
            style={{ width: 400, marginBottom: 10 }}
          >
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.currentTarget.value)}
            />
          </RoundInput>
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
        </form>
      </div>

      <div>
        <RoundButton
          style={{ width: 240, marginBottom: 10 }}
          onClick={submitHandler}
        >
          Sign Up
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
              <span className="ml-2">Sign Up with Google</span>
            </RoundButton>
          )}
          disabled={false}
          onSuccess={onGoogleLoginSuccess}
          onFailure={onGoogleLoginFail}
          cookiePolicy={`single_host_origin`}
          // isSignedIn={true}
        />
      </div>
    </div>
  );
};

export default RegisterScreen;
