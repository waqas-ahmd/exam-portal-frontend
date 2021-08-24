import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import React, { useState, useEffect, useCallback } from "react";
import RoundInput from "../../Components/RoundInput";
import RoundButton from "../../Components/RoundButton";
import Divider from "../../Components/Divider";
import DashboardCard from "../../Components/DashboardCard";
import {
  getStudentGroups,
  joinGroupRequest,
} from "../../Store/Actions/GroupActions";
import LinkContainer from "../../Components/LinkContainer";

const StudentGroupList = () => {
  const [addModal, setAddModal] = useState(false);
  const { studentGroups } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getStudentGroups());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fcsc flex1">
      {addModal && (
        <AddGroupModal show={addModal} onHide={() => setAddModal(false)} />
      )}
      <h2 className="my-3 p-text">Groups</h2>
      <Divider />
      <div className="frsbc w-100">
        <div className="t-bold p-text">My Groups</div>
        <RoundButton
          onClick={() => setAddModal(true)}
          style={{ width: 200, padding: 3 }}
        >
          Join Group
        </RoundButton>
      </div>
      <div className="py-2 w-100">
        <div className="py-2 w-100">
          {studentGroups.map((group, i) => (
            <LinkContainer key={i} to={`/group/${group._id}`}>
              <DashboardCard>
                <div className="frsbc p-text">
                  <div>{group.title}</div>
                  <div>
                    <em>{group.status}</em>
                  </div>
                </div>
              </DashboardCard>
            </LinkContainer>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddGroupModal = ({ show, onHide }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState();
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.users);
  const submitHandler = useCallback(async () => {
    if (code.length !== 0) {
      const data = await dispatch(joinGroupRequest(code));
      if (!data.error && socket) {
        socket.emit("groupJoinRequest", {
          teacherId: data.adminId,
          groupId: data._id,
          groupTitle: data.title,
        });
        onHide();
      } else {
        setError(data.error);
      }
    }
  }, [code, dispatch, onHide, socket]);
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h4 className="p-text">Add New Group</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <RoundInput className="w-100">
            <input
              placeholder="Enter Group Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </RoundInput>
          {error ? <div className="t-ctr mt-1">{error}</div> : null}
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

export default StudentGroupList;
