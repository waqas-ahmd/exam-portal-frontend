import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../Components/DashboardCard";
import Divider from "../../Components/Divider";
import RoundButton from "../../Components/RoundButton";
import RoundInput from "../../Components/RoundInput";
import LinkContainer from "../../Components/LinkContainer";
import {
  createGroup,
  getTeacherGroups,
} from "../../Store/Actions/GroupActions";

const TeacherGroupList = () => {
  const [createModal, setCreateModal] = useState(false);
  const { teacherGroups } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await dispatch(getTeacherGroups());
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fcsc flex1">
      {createModal && (
        <CreateGroupModal
          show={createModal}
          onHide={() => setCreateModal(false)}
        />
      )}
      <h2 className="my-3 p-text">Groups</h2>
      <Divider />
      <div className="frsbc w-100">
        <div className="t-bold p-text">My Groups</div>
        <RoundButton
          onClick={() => setCreateModal(true)}
          style={{ width: 200, padding: 3 }}
        >
          Create Group
        </RoundButton>
      </div>
      <div className="py-2 w-100">
        {teacherGroups.map((group, i) => (
          <DashboardCard key={i}>
            <div className="p-text frsbc">
              <LinkContainer to={`/group/${group._id}`}>
                <div>{group.title}</div>
              </LinkContainer>
              <div>Code: {group.code}</div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
};

const CreateGroupModal = ({ show, onHide }) => {
  const durations = ["Yearly", "Monthly", "Hourly"];
  const trails = [
    "No Free Trail",
    "First Month Free",
    "First Week Free",
    "First Day Free",
  ];
  const [title, setTitle] = useState();
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(durations[0]);
  const [freeTrail, setFreeTrail] = useState(trails[0]);
  const dispatch = useDispatch();
  const submitHandler = async () => {
    if (title) {
      if (title.length !== 0) {
        await dispatch(createGroup(title, amount, duration, freeTrail));
        onHide();
      }
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h4 className="p-text">Create New Group</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="w-100">
          <RoundInput className="w-100 mb-2">
            <input
              placeholder="Enter Group Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </RoundInput>
          <Divider />
          <div className="t-ctr mb-1">Class Fees</div>
          <div>Fee Amount</div>
          <RoundInput style={{ borderRadius: 7 }} className="w-100 mb-2">
            <input
              type="number"
              placeholder="Enter Fee Amount (Rs.)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </RoundInput>
          <div>Fee Duration</div>
          <RoundInput style={{ borderRadius: 7 }} className="w-100 mb-2">
            <select
              value={duration}
              onChange={(e) => setDuration(e.currentTarget.value)}
            >
              {durations.map((d, index) => (
                <option key={index} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </RoundInput>
          <div>Advanced</div>
          <RoundInput style={{ borderRadius: 7 }} className="w-100 mb-2">
            <select
              value={freeTrail}
              onChange={(e) => setFreeTrail(e.currentTarget.value)}
            >
              {trails.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
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
            Create
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TeacherGroupList;
