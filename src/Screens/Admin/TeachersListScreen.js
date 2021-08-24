import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DashboardCard from "../../Components/DashboardCard";
import Divider from "../../Components/Divider";
import {
  blockUser,
  getAllTeachers,
  unblockUser,
  updateTeacherAccess,
} from "../../Store/Actions/UserActions";
import { RiShieldStarFill } from "react-icons/ri";
import { Modal, Button } from "react-bootstrap";
import { MdHome, MdLocalPhone, MdEmail } from "react-icons/md";

const TeachersListScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const dispatch = useDispatch();
  const [accessModal, setAccessModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [userModal, setUserModal] = useState(false);

  const handleSelectUser = (userId) => {
    setSelected(userId);
    setUserModal(true);
  };

  const handleBlockUser = async () => {
    await dispatch(blockUser(selected));
    fetchUsers();
  };

  const handleUnblockUser = async () => {
    await dispatch(unblockUser(selected));
    fetchUsers();
  };

  const fetchUsers = async () => {
    const data = await dispatch(getAllTeachers());
    if (!data.error) {
      setTeachers(
        data.sort((a, b) =>
          a.firstname.toLowerCase() > b.firstname.toLowerCase() ? 1 : -1
        )
      );
    }
  };

  const handleAccessModal = () => {
    setUserModal(false);
    setAccessModal(true);
    // setSelected(t);
  };

  const handleConfirmAccessUpdate = async (id, code) => {
    const data = await dispatch(updateTeacherAccess(id, code));
    if (!data.error) {
      let updatedTeachers = [...teachers].filter(
        (t) => t._id.toString() !== id.toString()
      );
      updatedTeachers.push(data);
      setTeachers(
        updatedTeachers.sort((a, b) => (a.firstname > b.firstname ? 1 : -1))
      );
    }
    setAccessModal(false);
  };

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fcsc flex-1">
      <h2 className="my-3">Teachers List</h2>
      <Divider />
      {userModal && (
        <UserModal
          show={userModal}
          onHide={() => setUserModal(false)}
          user={teachers.find((s) => s._id.toString() === selected.toString())}
          block={handleBlockUser}
          unblock={handleUnblockUser}
          access={handleAccessModal}
        />
      )}
      {accessModal && (
        <AccessModal
          show={accessModal}
          onHide={() => setAccessModal(false)}
          teacher={teachers.find(
            (s) => s._id.toString() === selected.toString()
          )}
          confirm={handleConfirmAccessUpdate}
        />
      )}
      <div className="w-100">
        {teachers.map((t, i) => (
          <div onClick={() => handleSelectUser(t._id)}>
            <DashboardCard key={i}>
              <div className="frsbc">
                <div className="fccs">
                  <div className="frsc">
                    {t.firstname} {t.lastname}{" "}
                    {
                      <RiShieldStarFill
                        // onClick={() => handleAccessModal(t._id)}
                        size={22}
                        color={
                          t.teacherAccess === 2
                            ? "#f33"
                            : t.teacherAccess === 1
                            ? "#f93"
                            : "#5c5"
                        }
                      />
                    }
                  </div>
                  <div style={{ fontSize: "small" }}>{t.email}</div>
                </div>
              </div>
            </DashboardCard>
          </div>
        ))}
      </div>
    </div>
  );
};

const AccessModal = ({ show, onHide, teacher, confirm }) => {
  const [access, setAccess] = useState(teacher.teacherAccess || 0);

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <div className="p-text t-bold frsbc w-100">
          <div>Update Access</div>
          <div>
            Teacher: {teacher.firstname} {teacher.lastname}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div>Select Access Category</div>
        <div>
          <div className="frsc py-1" style={{ alignItems: "normal" }}>
            <div
              onClick={() => setAccess(0)}
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                border: "2px solid white",
                backgroundColor: access === 0 ? "#44f" : "#fff",
                marginRight: 5,
              }}
            ></div>
            <RiShieldStarFill size={22} color="#5c5" />
            <div>Basic Category</div>
          </div>
          <div className="frsc py-1" style={{ alignItems: "normal" }}>
            <div
              onClick={() => setAccess(1)}
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                border: "2px solid white",
                marginRight: 5,
                backgroundColor: access === 1 ? "#44f" : "#fff",
              }}
            ></div>
            <RiShieldStarFill size={22} color="#f93" />
            <div>Standard Category</div>
          </div>
          <div className="frsc py-1" style={{ alignItems: "normal" }}>
            <div
              onClick={() => setAccess(2)}
              style={{
                height: 20,
                width: 20,
                borderRadius: 20,
                border: "2px solid white",
                marginRight: 5,
                backgroundColor: access === 2 ? "#44f" : "#fff",
              }}
            ></div>
            <RiShieldStarFill size={22} color="#f33" />
            <div>Premium Category</div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="frsc w-100">
          <Button onClick={onHide} variant="secondary" className="mr-1" block>
            Cancel
          </Button>
          <Button
            onClick={() => confirm(teacher._id, access)}
            className="ml-1 mt-0"
            block
          >
            Save
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const UserModal = ({ show, onHide, user, block, unblock, access }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <div>
          <div style={{ fontWeight: "bold" }}>
            {user.firstname} {user.lastname}
          </div>
          <div style={{ fontSize: "smaller" }}>{user.role}</div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="frsc py-1">
          <div>
            <MdEmail size={24} />
          </div>
          <div className="ml-2">{user.email}</div>
        </div>
        <div className="frsc py-1">
          <div>
            <MdLocalPhone size={24} />
          </div>
          <div className="ml-2">{user.phone}</div>
        </div>
        <div className="frsc py-1">
          <div>
            <MdHome size={24} />
          </div>
          <div className="ml-2">{user.address}</div>
        </div>
        <div className="mb-3">
          Category :{" "}
          {user.teacherAccess === 0
            ? "Basic"
            : user.teacherAccess === 1
            ? "Standard"
            : "Premium"}
        </div>

        <div>
          <Button block onClick={access} variant="primary">
            Change Category
          </Button>

          {user.blocked ? (
            <Button block onClick={unblock} variant="primary">
              Unblock User
            </Button>
          ) : (
            <Button block onClick={block} variant="danger">
              Block User
            </Button>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="secondary" block>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeachersListScreen;
