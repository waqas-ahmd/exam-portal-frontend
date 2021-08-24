import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { MdAdd, MdRemove } from "react-icons/md";
import { IoMdRefreshCircle } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardCard from "../Components/DashboardCard";
import Divider from "../Components/Divider";
import RoundButton from "../Components/RoundButton";
import { useDispatch, useSelector } from "react-redux";
import {
  filterQuestions,
  getQuestions,
  googleFormQuestions,
} from "../Store/Actions/QuestionActions";
import { hasProperty } from "../utils/validation";
import { Button, Modal } from "react-bootstrap";
import { createExam } from "../Store/Actions/ExamActions";
import Loader from "../Components/Loader";
import RoundInput from "../Components/RoundInput";
import LinkContainer from "../Components/LinkContainer";
import { parse } from "query-string";
import { isPast } from "../utils/time";
import { addAnnouncement } from "../Store/Actions/GroupActions";

const CreateExamQuestionsScreen = () => {
  const { search } = useLocation();
  const groupId = parse(search).group || null;
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const { filteredQuestions } = useSelector((state) => state.questions);
  const [loading, setLoading] = useState(false);
  const [publishModal, setPublishModal] = useState(false);
  const [googleFormModal, setGoogleFormModal] = useState(false);

  const access = useSelector((state) => state.users.teacherAccess);

  const handleAddQuestion = (id) => {
    let question = filteredQuestions.filter((q) => q._id === id)[0];
    setSelectedQuestions([...selectedQuestions, { ...question, marks: 1 }]);
  };

  const handleRemoveQuestion = (id) => {
    setSelectedQuestions([...selectedQuestions].filter((q) => q._id !== id));
  };

  const setGoogleQuestionsSelected = (questions) => {
    setSelectedQuestions(
      questions.map((q) => ({
        ...q,
        marks: 1,
        image: null,
        syllabus: state.syllabus,
        grade: state.grade,
        subject: state.subject,
      }))
    );
  };

  const handleUpdateMarks = (m, id) => {
    let selectedQs = [...selectedQuestions];
    selectedQs.forEach((q) => {
      if (q._id === id) {
        q.marks = +m;
      }
    });
    setSelectedQuestions(selectedQs);
  };

  const handlePublishExam = () => {
    if (selectedQuestions.length === 0) {
      return;
    }
    setPublishModal(true);
  };

  const confirmPublish = async (date) => {
    const questions = selectedQuestions.map((q) => {
      return {
        statement: q.statement,
        choices: q.choices,
        correctChoice: q.correctChoice,
        type: q.type,
        image: q.image,
        marks: q.marks,
      };
    });
    const newExam = {
      title: state.title,
      subject: state.subject,
      grade: state.grade,
      duration: state.duration,
      syllabus: state.syllabus,
      questions,
      publishTime: date || new Date(),
    };
    const submittedExam = await dispatch(createExam(newExam));
    if (!submittedExam.error) {
      if (groupId) {
        const title = `New Exam: ${submittedExam.title}`;
        let body = "";
        if (!isPast(submittedExam.publishTime)) {
          body = `Scheduled on:\n\tDate: ${new Date(
            submittedExam.publishTime
          ).toLocaleDateString()}\n\tTime: ${new Date(
            submittedExam.publishTime
          ).toLocaleTimeString()}\nExam Code: ${
            submittedExam.code
          }\n<a href="https://exam-portal-development.netlify.app/exam/${
            submittedExam._id
          }">Exam Link<a/>`;
        } else {
          body = `Available to Attempt\nExam Code: ${submittedExam.code}\n<a href="https://exam-portal-development.netlify.app/exam/${submittedExam._id}">Exam Link<a/>`;
        }
        await dispatch(addAnnouncement(title, body, groupId));
        setPublishModal(false);
        navigate(`/group/${groupId}`);
      } else {
        setPublishModal(false);
        navigate("/exams");
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await dispatch(getQuestions());
    dispatch(
      filterQuestions({
        grade: state.grade,
        subject: state.subject,
        syllabus: state.syllabus,
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (state === null) {
        navigate("/create-exam/settings");
      } else {
        await fetchData();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === null) {
    return <></>;
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
      }}
    >
      {publishModal && (
        <PublishModal
          show={publishModal}
          onHide={() => setPublishModal(false)}
          confirm={(date) => confirmPublish(date)}
          access={access}
        />
      )}

      {googleFormModal && (
        <GoogleFormModal
          show={googleFormModal}
          onHide={() => setGoogleFormModal(false)}
          setGoogleQuestions={setGoogleQuestionsSelected}
        />
      )}

      <div style={{ margin: "20px auto 0px" }}>
        <h4 className="p-text" style={{ fontWeight: "bold" }}>
          Create New Exam
        </h4>
      </div>
      <Divider />
      <div className="p-text" style={{ fontWeight: 400, fontSize: "xx-large" }}>
        {state.title}
      </div>
      <Divider />
      <div
        className="create-exam-details-01"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text">Subject: </div>
          <div className="p-text" style={{ fontWeight: 550, marginLeft: 3 }}>
            {state.subject}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text">Grade: </div>
          <div className="p-text" style={{ fontWeight: 550, marginLeft: 3 }}>
            {state.grade}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text">Syllabus: </div>
          <div className="p-text" style={{ fontWeight: 550, marginLeft: 3 }}>
            {state.syllabus}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text">Duration: </div>
          <div className="p-text" style={{ fontWeight: 550, marginLeft: 3 }}>
            {state.duration} mins
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="p-text">Total Marks: </div>
          <div className="p-text" style={{ fontWeight: 550, marginLeft: 3 }}>
            {selectedQuestions.length === 0
              ? "0"
              : selectedQuestions.reduce((a, b) => a + b.marks, 0)}
          </div>
        </div>
      </div>
      <Divider />
      <div
        style={{
          marginTop: 5,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="p-text">Selected Questions</div>
        <div>
          <RoundButton
            onClick={handlePublishExam}
            style={{ width: 250, padding: "4px 5px", marginBottom: 10 }}
          >
            Publish Exam
          </RoundButton>
          <RoundButton
            onClick={() => setGoogleFormModal(true)}
            style={{ width: 250, padding: "4px 5px" }}
          >
            Create from Google Form
          </RoundButton>
        </div>
      </div>
      <div style={{ width: "100%", marginTop: 10 }}>
        {selectedQuestions.length > 0 ? (
          selectedQuestions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              add={handleAddQuestion}
              remove={handleRemoveQuestion}
              selected={true}
              updateMarks={handleUpdateMarks}
            />
          ))
        ) : (
          <div className="p-text" style={{ textAlign: "center" }}>
            No Question Selected
          </div>
        )}
      </div>
      <Divider />
      <div
        style={{
          marginTop: 5,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div className="p-text">Available Questions</div>
          <div
            onClick={fetchData}
            className={`${loading ? "rotation " : ""}p-text`}
            style={{ marginLeft: 5 }}
          >
            <IoMdRefreshCircle size={24} />
          </div>
        </div>
        <div>
          <LinkContainer
            to={`/questions?subject=${state.subject}&grade=${state.grade}&syllabus=${state.syllabus}`}
          >
            <RoundButton style={{ width: 200, padding: "4px 5px" }}>
              Add New Question
            </RoundButton>
          </LinkContainer>
        </div>
      </div>
      <div style={{ width: "100%", marginTop: 10 }}>
        {loading ? (
          <Loader msg="Loading Questions" />
        ) : filteredQuestions.length ? (
          filteredQuestions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              add={handleAddQuestion}
              remove={handleRemoveQuestion}
              hide={hasProperty(selectedQuestions, "_id", question._id)}
            />
          ))
        ) : (
          <div style={{ textAlign: "center" }} className="p-text">
            No Question Found
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({
  question,
  add,
  remove,
  selected,
  hide,
  updateMarks,
}) => {
  const [expanded, setExpanded] = useState(false);
  const handleAddQuestion = () => {
    add(question._id);
  };
  const handleRemoveQuestion = () => {
    remove(question._id);
  };

  const handleChangeMarks = (m) => {
    updateMarks(m, question._id);
  };
  if (hide) {
    return <></>;
  }
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
        <div className="p-text">{question.statement}</div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {selected && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div>Marks</div>
              <RoundInput
                style={{
                  padding: "0px 5px",
                  width: 40,
                  margin: "0px 5px",
                  borderRadius: 3,
                }}
              >
                <input
                  className="mark-input-001"
                  style={{ textAlign: "right" }}
                  type="number"
                  value={question.marks}
                  onChange={(e) => handleChangeMarks(e.target.value)}
                />
              </RoundInput>
            </div>
          )}
          <div
            onClick={() => setExpanded(!expanded)}
            style={{
              cursor: "pointer",
            }}
          >
            {expanded ? (
              <RiArrowDropUpLine color="#888" size={24} />
            ) : (
              <RiArrowDropDownLine color="#888" size={24} />
            )}
          </div>

          <div
            style={{
              background: "#555",
              padding: "0px 4px",
              borderRadius: 2,
              cursor: "pointer",
              marginLeft: 5,
            }}
          >
            {selected ? (
              <MdRemove onClick={handleRemoveQuestion} color="#fff" size={22} />
            ) : (
              <MdAdd onClick={handleAddQuestion} color="#fff" size={22} />
            )}
          </div>
        </div>
      </div>
      {expanded ? (
        <>
          <div className="mt-3">
            {question.choices
              ? question.choices.map((choice, index) => (
                  <div
                    className="p-text"
                    key={index}
                    style={{
                      padding: "3px 10px",
                      marginBottom: 5,
                      border: "1px solid #888",
                      borderRadius: 3,
                      width: "fit-content",
                      minWidth: 200,
                    }}
                  >
                    {choice}
                  </div>
                ))
              : null}
          </div>
          {question.image !== null && (
            <div
              style={{
                height: "fit-content",
                width: "fit-content",
                maxWidth: "90%",
                padding: 2,
                background: "#ddd",
                borderRadius: 3,
              }}
            >
              <a href={question.image} target="_blank" rel="noreferrer">
                <img
                  src={question.image}
                  style={{ maxHeight: 200, maxWidth: "100%" }}
                  alt="question-img"
                />
              </a>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <div className="p-text" style={{ fontSize: "small" }}>
              {question.subject}, Grade {question.grade}, {question.syllabus},{" "}
              {question.type}
            </div>
          </div>
        </>
      ) : null}
    </DashboardCard>
  );
};
const PublishModal = ({ show, onHide, confirm, access }) => {
  const [now, setNow] = useState(true);
  const [date, setDate] = useState(null);
  return (
    <Modal centered backdrop="static" show={show} onHide={onHide}>
      <Modal.Header>
        <h5 className="p-text">Publish Exam</h5>
      </Modal.Header>
      <Modal.Body>
        {access !== 0 && (
          <>
            <div>Select Publish Date</div>
            <div>
              <div className="frsc py-1" style={{ alignItems: "normal" }}>
                <div
                  onClick={() => setNow(true)}
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 20,
                    border: "2px solid white",
                    backgroundColor: now ? "#44f" : "#fff",
                    marginRight: 5,
                  }}
                ></div>
                <div>Publish Now</div>
              </div>
              <div className="frsc py-1" style={{ alignItems: "normal" }}>
                <div
                  onClick={() => setNow(false)}
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: 20,
                    border: "2px solid white",
                    marginRight: 5,
                    backgroundColor: !now ? "#44f" : "#fff",
                  }}
                ></div>
                <div>Schedule for Later</div>
              </div>
              {!now && (
                <RoundInput>
                  <input
                    type="datetime-local"
                    onChange={(e) => setDate(new Date(e.target.value))}
                  />
                </RoundInput>
              )}
            </div>
            <Divider />
          </>
        )}

        <div className="p-text">
          Once Published, you won't be able to do any changes.
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
              Cancel
            </Button>
          </div>

          <div style={{ width: "49%" }}>
            <Button
              block
              variant="primary"
              onClick={() => (!now ? confirm(date) : confirm(null))}
            >
              Publish
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const GoogleFormModal = ({ show, onHide, setGoogleQuestions }) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");

  const handleFetch = async () => {
    const data = await dispatch(googleFormQuestions(link));
    if (data.questions) {
      setGoogleQuestions(data.questions);

      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>Add Questions from Google Form</Modal.Header>
      <Modal.Body>
        <div>
          <RoundInput>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste Link Here"
            />
          </RoundInput>
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
            <Button onClick={handleFetch} block>
              Import
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateExamQuestionsScreen;
