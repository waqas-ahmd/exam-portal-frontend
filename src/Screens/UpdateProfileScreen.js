import React, { useEffect, useState } from "react";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "../utils/validation";
import { Modal, Spinner, Button } from "react-bootstrap";
import { MdError } from "react-icons/md";
import { updateProfile } from "../Store/Actions/UserActions";

const UpdateProfileScreen = () => {
  const formErrorsInitial = {
    firstname: false,
    lastname: false,
    phone: false,
    address: false,
  };
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState(formErrorsInitial);
  const [forceValidation, setForceValidation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users.userData);

  const closeModal = () => {
    setShowModal(false);
    setError(false);
    setLoading(false);
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
        updateProfile({
          firstname,
          lastname,
          phone,
          address,
        })
      );
      if (data.error) {
        setError(data.error);
      } else {
        setShowModal(false);
        setSuccessModal(true);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userData) {
      setFirstname(userData.firstname || "");
      setLastname(userData.lastname || "");
      setPhone(userData.phone === "null" ? "" : userData.phone);
      setAddress(userData.address === "null" ? "" : userData.address);
    } else {
      return;
    }
  }, [userData]);

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
  }, [address, firstname, lastname, phone]);
  return (
    <div className="register-page t-ctr flex1 fccc">
      {/* Modal Showing the Loading and Errors */}
      {successModal && (
        <Modal
          centered
          show={successModal}
          onHide={() => setSuccessModal(false)}
        >
          <Modal.Body>
            <div className="p-text">Profile Updated Successfully</div>
          </Modal.Body>
          <Modal.Footer>
            <Button block onClick={() => setSuccessModal(false)}>
              Okay
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <div
          style={{
            height: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <>
              <Spinner animation="border" role="status"></Spinner>
              <h3>Updating Profile</h3>
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

      <h3 className="p-text" style={{ fontWeight: "bold" }}>
        Update Profile
      </h3>

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
        </form>
      </div>

      <div>
        <RoundButton
          style={{ width: 200, marginBottom: 10 }}
          onClick={submitHandler}
        >
          Update
        </RoundButton>
      </div>
    </div>
  );
};

export default UpdateProfileScreen;
