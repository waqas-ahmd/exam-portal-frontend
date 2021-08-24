import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DashboardCard from "../../Components/DashboardCard";
import Divider from "../../Components/Divider";
import {
  blockUser,
  getAllStudents,
  unblockUser,
} from "../../Store/Actions/UserActions";
import { Modal, Button } from "react-bootstrap";
import { MdHome, MdLocalPhone, MdEmail } from "react-icons/md";

const StudentsListScreen = () => {
  const [students, setStudents] = useState([]);
  const dispatch = useDispatch();
  const [userModal, setUserModal] = useState(false);
  const [selected, setSelected] = useState(null);

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
    const data = await dispatch(getAllStudents());
    if (!data.error) {
      setStudents(
        data.sort((a, b) =>
          a.firstname.toLowerCase() > b.firstname.toLowerCase() ? 1 : -1
        )
      );
    }
  };

  useEffect(() => {
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fcsc flex-1">
      {userModal && (
        <UserModal
          show={userModal}
          onHide={() => setUserModal(false)}
          user={students.find((s) => s._id.toString() === selected.toString())}
          block={handleBlockUser}
          unblock={handleUnblockUser}
        />
      )}

      <h2 className="my-3">Students List</h2>
      <Divider />
      <div className="w-100">
        {students.map((s, i) => (
          <div key={i} onClick={() => handleSelectUser(s._id)}>
            <DashboardCard>
              <div className="frsbc">
                <div className="fccs">
                  <div>
                    {s.firstname} {s.lastname}
                  </div>
                  <div style={{ fontSize: "small" }}>{s.email}</div>
                </div>
              </div>
            </DashboardCard>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserModal = ({ show, onHide, user, block, unblock }) => {
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

        <div>
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

export default StudentsListScreen;
