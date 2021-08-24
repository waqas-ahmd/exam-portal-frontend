import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getStudentGroupById, updatePayment } from "../../Store/Actions/GroupActions";
import Loader from "../../Components/Loader";
import Divider from "../../Components/Divider";
import { Button, Modal } from "react-bootstrap";
import RoundButton from "../../Components/RoundButton";
import { useSelector } from "react-redux";
import RoundInput from "../../Components/RoundInput"
import CreditCardInput from 'react-credit-card-input';


const StudentGroup = () => {
  const id = useLocation().pathname.split("/")[2];
  const [group, setGroup] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [membersModal, setMembersModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [error, setError] = useState(false);
  const userId = useSelector((state) => state.users.userData._id);

  const payFee = async () => {
    const data = await dispatch(updatePayment(group._id))
    if (!data.error) {
      setGroup(data)
      setPaymentModal(false)
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(false);
    (async () => {
      const data = await dispatch(getStudentGroupById(id));
      if (!data.error) {
        setGroup(data);
        setAnnouncements(data.messages.reverse());
      } else {
        setError(data.error);
      }
    })();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div>
        <Loader msg="Loading" />
      </div>
    );
  }
  return (
    <div className="fcsc flex1">
      {group ? (
        <>
          {membersModal && (
            <MembersModal
              members={group.students.reverse()}
              show={membersModal}
              onHide={() => setMembersModal(false)}
            />
          )}
          {paymentModal && (
            <PaymentModal
              amount={group.feeAmount}
              show={paymentModal}
              onHide={() => setPaymentModal(false)}
              payment={payFee}
            />
          )}
          <div className="my-3 frsbc w-100">
            <div>
              <h2 className="p-text">{group.title}</h2>

              {group.students.find((s) => s.id.toString() === userId.toString())
                .paid ? (
                <div
                  className="px-3 py-1 t-ctr"
                  style={{
                    backgroundColor: "#4f4",
                    borderRadius: 4,
                  }}
                >
                  Fee Paid
                </div>
              ) : (
                <div className="frcc">
                  <div
                    className="px-3 py-1 t-ctr"
                    style={{
                      backgroundColor: "#f44",
                      borderRadius: 4,
                    }}
                  >
                    Fee Unpaid
                  </div>
                  <Button onClick={() => setPaymentModal(true)} className="py-1 ml-1">Pay Now</Button>
                </div>
              )}
            </div>
            <RoundButton
              onClick={() => setMembersModal(true)}
              className="py-1"
              style={{ width: 200 }}
            >
              Group Members
            </RoundButton>
          </div>
          <Divider />
          <div className="frsbc w-100">
            <h4 className="p-text">Announcements</h4>
          </div>
          {announcements.map((m, i) => (
            <Announcement message={m} key={i} />
          ))}
        </>
      ) : (
        <div className="p-text py-3">{error}</div>
      )}
    </div>
  );
};

const Announcement = ({ message }) => {
  return (
    <div className="p-text w-100 p-2 my-2 announcementBox">
      <div className="w-100 frsbc">
        <div className="t-bold">{message.title}</div>
        <div style={{ fontSize: "smaller" }}>
          {new Date(message.time).toLocaleString()}
        </div>
      </div>
      <Divider />
      <div
        dangerouslySetInnerHTML={{ __html: message.body }}
        style={{ whiteSpace: "pre-wrap" }}
      ></div>
    </div>
  );
};

const MembersModal = ({ show, onHide, members }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h4 className="p-text">Group Members</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <div style={{ height: "50vh" }}>
            <div style={{ height: "50vh", padding: 10 }}>
              {members
                .filter((m) => m.status === "approved")
                .map((m) => (
                  <div className="frsbc py-2">
                    <div className="p-text">{m.name}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} block variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};



const PaymentModal = ({ show, onHide, amount, payment }) => {

  const [cardNumber, setCardNumber] = useState()
  const [expiry, setExpiry] = useState()
  const [cvc, setCvc] = useState()
  return <Modal show={show} onHide={onHide} centered backdrop="static">

    <Modal.Header>
      <div>
        Fee Payment
      </div>
    </Modal.Header>

    <Modal.Body>
      <RoundInput style={{ borderRadius: 7 }}>
        <CreditCardInput
          cardNumberInputProps={{ value: cardNumber, onChange: e => setCardNumber(e.target.value) }}
          cardExpiryInputProps={{ value: expiry, onChange: e => setExpiry(e.target.value) }}
          cardCVCInputProps={{ value: cvc, onChange: e => setCvc(e.target.value) }}
          fieldClassName="input"
        />
      </RoundInput>
    </Modal.Body>

    <Modal.Footer>
      <div className="frcc w-100">
        <Button block variant="secondary" onClick={onHide} >Cancel</Button>
        <Button block className="ml-1 mt-0" onClick={payment}>Pay Rs.{amount}</Button>
      </div>
    </Modal.Footer>

  </Modal>
}

export default StudentGroup;
