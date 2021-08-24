import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  addAnnouncement,
  getTeacherGroupById,
  removeAnnouncement,
  updateMember,
} from "../../Store/Actions/GroupActions";
import Loader from "../../Components/Loader";
import Divider from "../../Components/Divider";
import { Button, Dropdown, Modal, Tab, Tabs } from "react-bootstrap";
import RoundInput from "../../Components/RoundInput";
import { isEmpty } from "../../utils/validation";
import { FaTrash } from "react-icons/fa";
import { CgMenu } from "react-icons/cg";

const TeacherGroup = () => {
  const location = useLocation();
  const [group, setGroup] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [addAnnoucementModal, setAddAnnouncementModal] = useState(false);
  const [membersModal, setMembersModal] = useState(false);
  const { socket } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const submitAnnouncement = async (title, body) => {
    const data = await dispatch(addAnnouncement(title, body, group._id));
    if (!data.error) {
      setGroup(data);
      setAnnouncements(data.messages.reverse());
    }
  };

  const approveMember = useCallback(
    async (memberId) => {
      const data = await dispatch(
        updateMember(memberId, "approved", group._id)
      );
      if (!data.error) {
        setGroup(data);
        setAnnouncements(data.messages.reverse());
        socket.emit("groupJoinResponse", {
          studentId: memberId,
          groupId: group._id,
          groupTitle: group.title,
          response: "approved",
        });
      }
    },
    [dispatch, group, socket]
  );

  const rejectMember = useCallback(
    async (memberId) => {
      const data = await dispatch(
        updateMember(memberId, "rejected", group._id)
      );
      if (!data.error) {
        setGroup(data);
        setAnnouncements(data.messages.reverse());
        socket.emit("groupJoinResponse", {
          studentId: memberId,
          groupId: group._id,
          groupTitle: group.title,
          response: "rejected",
        });
      }
    },
    [dispatch, group, socket]
  );

  const handleRemoveMessage = async (msgId) => {
    // console.log(msgId, "removed from", group._id);
    const data = await dispatch(removeAnnouncement(group._id, msgId));
    if (!data.error) {
      setGroup(data);
      setAnnouncements(data.messages.reverse());
    }
  };

  const removeMember = useCallback(
    async (memberId) => {
      const data = await dispatch(updateMember(memberId, "removed", group._id));
      if (!data.error) {
        setGroup(data);
        setAnnouncements(data.messages.reverse());
        socket.emit("groupRemove", {
          studentId: memberId,
          groupId: group._id,
          groupTitle: group.title,
        });
      }
    },
    [dispatch, group, socket]
  );

  useEffect(() => {
    setLoading(true);
    (async () => {
      const data = await dispatch(
        getTeacherGroupById(location.pathname.split("/")[2])
      );
      if (!data.error) {
        setGroup(data);
        setAnnouncements(data.messages.reverse());
      }
    })();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

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
          {addAnnoucementModal && (
            <AddAnnouncementModal
              announce={submitAnnouncement}
              show={addAnnoucementModal}
              onHide={() => setAddAnnouncementModal(false)}
            />
          )}
          {membersModal && (
            <MembersModal
              approve={approveMember}
              remove={removeMember}
              reject={rejectMember}
              members={group.students.reverse()}
              show={membersModal}
              onHide={() => setMembersModal(false)}
            />
          )}
          <div className="my-3 frsbc w-100">
            <h2 className="p-text">{group.title}</h2>
            {/* <RoundButton
              onClick={() => setMembersModal(true)}
              className="py-1"
              style={{ width: 200 }}
            >
              Group Members
            </RoundButton> */}
            <div className="custom-dropdown">
              <Dropdown>
                <Dropdown.Toggle
                  menuAlign="right"
                  id="dropdown-menu-align-right"
                >
                  <CgMenu size={28} color="#888" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setMembersModal(true)}>
                    Group Members
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setAddAnnouncementModal(true)}>
                    New Announcement
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      navigate(`/create-exam/settings?group=${group._id}`)
                    }
                  >
                    Create Exam For this Group
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Divider />
          <div className="frsbc w-100">
            <h4 className="p-text">Announcements</h4>
          </div>
          {announcements.map((m, i) => (
            <Announcement
              message={m}
              key={i}
              remove={() => handleRemoveMessage(m._id)}
            />
          ))}
        </>
      ) : (
        <div className="p-text ">No Group Found</div>
      )}
    </div>
  );
};

const Announcement = ({ message, remove }) => {
  return (
    <div className="p-text w-100 p-2 my-2 announcementBox">
      <div className="w-100 frsbc">
        <div className="t-bold">{message.title}</div>
        <div className="frcc">
          <div style={{ fontSize: "smaller" }}>
            {new Date(message.time).toLocaleString()}
          </div>

          <div onClick={remove} className="ml-3">
            <FaTrash color="red" />
          </div>
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

const MembersModal = ({ show, onHide, members, approve, remove, reject }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h4 className="p-text">Group Members</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <Tabs defaultActiveKey="approved" id="uncontrolled-tab-example">
            <Tab
              eventKey="approved"
              title={`Approved (${
                members.filter((m) => m.status === "approved").length
              })`}
            >
              <div style={{ height: "50vh" }}>
                <div style={{ height: "50vh", padding: 10 }}>
                  {members
                    .filter((m) => m.status === "approved")
                    .map((m) => (
                      <div className="frsbc py-2">
                        <div className="frcc">
                          <div className="p-text">{m.name}</div>
                          {m.paid ? (
                            <div
                              className="ml-1 p-1 t-ctr"
                              style={{
                                backgroundColor: "#4f4",
                                borderRadius: 4,
                              }}
                            >
                              Fee Paid
                            </div>
                          ) : (
                            <div
                              className="ml-1 p-1 t-ctr"
                              style={{
                                backgroundColor: "#f44",
                                borderRadius: 4,
                              }}
                            >
                              Fee Unpaid
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => remove(m.id)}
                          className="py-0"
                          variant="danger"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </Tab>
            <Tab
              className="flex-1"
              eventKey="pending"
              title={`Pending (${
                members.filter((m) => m.status === "pending").length
              })`}
            >
              <div style={{ height: "50vh", padding: 10 }}>
                {members
                  .filter((m) => m.status === "pending")
                  .map((m) => (
                    <div className="frsbc py-2">
                      <div className="p-text">{m.name}</div>
                      <div className="frcc">
                        <Button
                          onClick={() => reject(m.id)}
                          className="py-0 mr-1"
                          variant="danger"
                        >
                          Reject
                        </Button>
                        <Button onClick={() => approve(m.id)} className="py-0">
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </Tab>
          </Tabs>
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

const AddAnnouncementModal = ({ show, onHide, announce }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState({ title: false, body: false });
  const [forceValidation, setForceValidation] = useState(false);
  const submitHandler = async () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }
    await announce(title, body);
    onHide();
  };

  useEffect(() => {
    let newFormErrors = { title: false, body: false };
    let formError = true;
    if (isEmpty(title)) {
      newFormErrors.title = "REQUIRED";
      formError = false;
    }
    if (isEmpty(body)) {
      newFormErrors.body = "REQUIRED";
      formError = false;
    }

    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body]);
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h4 className="p-text">New Announcement</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <RoundInput
            validation={{
              force: forceValidation,
              value: formErrors.title,
            }}
            className="mb-2"
          >
            <input
              value={title}
              placeholder="Add Title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </RoundInput>
          <RoundInput
            validation={{
              force: forceValidation,
              value: formErrors.body,
            }}
            className="mb-2"
            style={{ borderRadius: 5 }}
          >
            <textarea
              value={body}
              placeholder="Add Description"
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </RoundInput>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 frcc">
          <Button
            className="mt-0 mr-1"
            onClick={onHide}
            block
            variant="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={submitHandler}
            className="mt-0 ml-1"
            block
            variant="primary"
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherGroup;
