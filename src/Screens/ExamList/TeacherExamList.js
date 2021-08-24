/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import DashboardCard from "../../Components/DashboardCard";
import RoundButton from "../../Components/RoundButton";
import RoundInput from "../../Components/RoundInput";
import {
  deleteTeacherExam,
  getTeacherExams,
} from "../../Store/Actions/ExamActions";
import Loader from "../../Components/Loader";
import LinkContainer from "../../Components/LinkContainer";
import { Modal, Button } from "react-bootstrap";
import { MdDeleteForever } from "react-icons/md";
import { IoMdShareAlt } from "react-icons/io";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { subjects, grades, withAll, syllabuses } from "../../Data/DataArrays";
import { isPast } from "../../utils/time";
import { addAnnouncement } from "../../Store/Actions/GroupActions";

const TeacherExamList = () => {
  const navigate = useNavigate();
  const { teacherExams } = useSelector((state) => state.exams);
  const { userData } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [loading, setLaoding] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [examToShare, setExamToShare] = useState(null);
  const [errorModal, setErrorModal] = useState(false);
  const [error, setError] = useState(false);
  const access = useSelector((state) => state.users.teacherAccess);

  const handleCreateExam = () => {
    navigate("/create-exam/settings");
  };

  const handleDeleteExam = (id) => {
    setDeleteModal(true);
    setExamToDelete(id);
  };

  const handleShareExam = (id) => {
    setExamToShare(id);
    setShareModal(true);
  };

  const handleConfirmDelete = async () => {
    const data = await dispatch(deleteTeacherExam(examToDelete));
    setDeleteModal(false);
    if (data.error) {
      setErrorModal(true);
      setError(data.error);
    }
  };

  const handleConfirmShare = async (exam, groupIds) => {
    groupIds.forEach(async (id) => {
      const title = `New Exam: ${exam.title}`;
      let body = "";
      if (!isPast(exam.publishTime)) {
        body = `Scheduled on:\nDate: ${new Date(
          exam.publishTime
        ).toLocaleDateString()}\nTime: ${new Date(
          exam.publishTime
        ).toLocaleTimeString()}\nExam Code: ${
          exam.code
        }\nLink: https://exam-portal-development.netlify.app/exam/${exam._id}`;
      } else {
        body = `Available to Attempt:\nExam Code: ${exam.code}\n<a href="https://exam-portal-development.netlify.app/exam/${exam._id}">Exam Link<a/>`;
      }
      await dispatch(addAnnouncement(title, body, id));
    });
    setShareModal(false);
  };

  useEffect(() => {
    (async () => {
      setLaoding(true);
      await dispatch(getTeacherExams());
      setLaoding(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="fcsc flex1">
      {deleteModal && (
        <DeleteModal
          show={deleteModal}
          onHide={() => setDeleteModal(false)}
          confirm={handleConfirmDelete}
        />
      )}
      {shareModal && (
        <ShareModal
          show={shareModal}
          onHide={() => setShareModal(false)}
          confirm={handleConfirmShare}
          exam={teacherExams.find(
            (e) => e._id.toString() === examToShare.toString()
          )}
        />
      )}
      {errorModal && (
        <Modal show={errorModal} onHide={() => setErrorModal(false)} centered>
          <div style={{ padding: "30px" }}>{error}</div>
        </Modal>
      )}
      <div style={{ margin: "20px auto" }}>
        <h4 className="p-text" style={{ fontWeight: "bold" }}>
          Exams
        </h4>
      </div>
      {access !== 0 && (
        <div
          className="dashboard-selectors-container-01"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="dashboard-selector-01"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="p-text" style={{ marginRight: 5 }}>
              Subject
            </div>

            <RoundInput style={{ width: 200, padding: "3px 10px" }}>
              <select>
                {withAll(subjects).map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </RoundInput>
          </div>
          <div
            className="dashboard-selector-01"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="p-text" style={{ marginRight: 5 }}>
              Grade
            </div>
            <RoundInput style={{ width: 200, padding: "3px 10px" }}>
              <select>
                {withAll(grades).map((grade, index) => (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </RoundInput>
          </div>
          <div
            className="dashboard-selector-01"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div className="p-text" style={{ marginRight: 5 }}>
              Syllabus
            </div>
            <RoundInput style={{ width: 200, padding: "3px 10px" }}>
              <select>
                {withAll(syllabuses).map((syllabus, index) => (
                  <option key={index} value={syllabus}>
                    {syllabus}
                  </option>
                ))}
              </select>
            </RoundInput>
          </div>
        </div>
      )}
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #999",
          margin: "10px 0px",
        }}
      ></div>
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
          onClick={handleCreateExam}
          style={{ padding: "3px", width: 200 }}
        >
          Create New Exam
        </RoundButton>
      </div>
      <div style={{ width: "100%", marginTop: 10 }}>
        {loading ? (
          <Loader msg="Loading Exams" />
        ) : teacherExams.length !== 0 ? (
          teacherExams.map((exam, index) => (
            <ExamCard
              key={index}
              exam={exam}
              onDelete={() => handleDeleteExam(exam._id)}
              onShare={() => handleShareExam(exam._id)}
            />
          ))
        ) : (
          <div className="p-text">No Exam</div>
        )}
      </div>
    </div>
  );
};

export default TeacherExamList;

const DeleteModal = ({ show, onHide, confirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h5 className="p-text">Delete Exam</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="p-text">
          This Action is Permanent! <br />
          Do you Really Want to Delete This Exam ?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%" }}>
            <Button block variant="secondary" onClick={onHide}>
              No
            </Button>
          </div>

          <div style={{ width: "49%" }}>
            <Button onClick={confirm} block variant="danger">
              Yes
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const ShareModal = ({ show, onHide, confirm, exam }) => {
  const { teacherGroups } = useSelector((state) => state.groups);
  const [selectedGroups, setSelectdGroups] = useState([]);
  const toggleSelect = (id) => {
    if (selectedGroups.includes(id)) {
      setSelectdGroups(selectedGroups.filter((sg) => sg !== id));
    } else {
      setSelectdGroups([...selectedGroups, id]);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h5 className="p-text">Share Exam: {exam.title}</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="p-text" style={{ maxHeight: "40vh" }}>
          <div>Select Groups</div>
          {teacherGroups.map((g) => (
            <div
              className="frsc my-1"
              onClick={() => toggleSelect(g._id)}
              key={g._id}
            >
              {selectedGroups.includes(g._id) ? (
                <ImCheckboxChecked size={22} />
              ) : (
                <ImCheckboxUnchecked size={22} />
              )}

              <div className="ml-1">{g.title}</div>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "49%" }}>
            <Button block variant="secondary" onClick={onHide}>
              No
            </Button>
          </div>

          <div style={{ width: "49%" }}>
            <Button
              disabled={selectedGroups.length === 0}
              onClick={() => confirm(exam, selectedGroups)}
              block
            >
              Share
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const ExamCard = ({ exam, onDelete, onShare }) => {
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
          <div className="p-text">
            <div>{exam.title}</div>
            <div style={{ fontSize: "small" }}>
              {!isPast(exam.publishTime)
                ? `Scheduled on ${new Date(exam.publishTime).toLocaleString()} `
                : "Published"}
            </div>
          </div>
        </LinkContainer>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text" style={{ fontFamily: "monospace" }}>
            Code: {exam.code}
          </div>

          <div className="ml-3 c-ptr">
            <MdDeleteForever onClick={onDelete} color="#f44" size={20} />
          </div>
          <div className="ml-3 c-ptr">
            <IoMdShareAlt onClick={onShare} color="#44f" size={20} />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
