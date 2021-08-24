/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardCard from "../../Components/DashboardCard";
import RoundButton from "../../Components/RoundButton";
import RoundInput from "../../Components/RoundInput";
import {
  getStudentExams,
  updateStudentExams,
} from "../../Store/Actions/ExamActions";
import Loader from "../../Components/Loader";
import { Modal, Button } from "react-bootstrap";
import LinkContainer from "../../Components/LinkContainer";
import Divider from "../../Components/Divider";

const StudentExamList = () => {
  const { studentExams } = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const handleAddExam = () => {
    setAddModal(true);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(getStudentExams());
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fcsc flex1">
      {addModal && (
        <AddModal show={addModal} onHide={() => setAddModal(false)} />
      )}
      <div style={{ margin: "20px auto" }}>
        <h4 className="p-text" style={{ fontWeight: "bold" }}>
          My Exams
        </h4>
      </div>
      <Divider />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="p-text" style={{ fontWeight: "bold" }}>
          Exams List
        </div>
        <RoundButton
          onClick={handleAddExam}
          style={{ padding: "3px", width: 200 }}
        >
          Add New Exam
        </RoundButton>
      </div>
      <div style={{ width: "100%", marginTop: 10 }}>
        {loading ? (
          <Loader msg="Loading Exams" />
        ) : studentExams.length !== 0 ? (
          studentExams.map((exam, index) => (
            <ExamCard key={index} exam={exam} />
          ))
        ) : (
          <div className="p-text">No Exam</div>
        )}
      </div>
    </div>
  );
};

const AddModal = ({ show, onHide }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const handleFindExam = async () => {
    const data = await dispatch(updateStudentExams(code));
    if (data.error) {
      setError(data.error);
    } else {
      setError(null);
      onHide();
    }
  };

  return (
    <Modal centered backdrop="static" show={show} onHide={onHide}>
      <Modal.Header>
        <h5>Add New Exam</h5>
      </Modal.Header>
      <Modal.Body>
        <RoundInput>
          <input
            placeholder="Enter Exam Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </RoundInput>
        <RoundButton onClick={handleFindExam} style={{ marginTop: 10 }}>
          Add Exam
        </RoundButton>
        {error !== null ? (
          <div style={{ textAlign: "center", marginTop: 10, color: "#f44" }}>
            {error}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} variant="secondary" block>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const ExamCard = ({ exam }) => {
  const [examDate, setExamDate] = useState(new Date(exam.publishTime));
  const [currentDate, setCurrentDate] = useState(new Date());
  return (
    <DashboardCard>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <LinkContainer to={`/exam/${exam._id}`}>
          <div className="p-text">{exam.title}</div>
        </LinkContainer>

        <div className="p-text">
          {exam.marked ? (
            "Exam Marked"
          ) : exam.attempted ? (
            "Exam Attempted"
          ) : examDate.toISOString() > currentDate.toISOString() ? (
            `Scheduled on ${examDate.toLocaleString()} `
          ) : (
            <LinkContainer to={`/exam/${exam._id}`}>
              <Button>Attempt Exam</Button>
            </LinkContainer>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default StudentExamList;
