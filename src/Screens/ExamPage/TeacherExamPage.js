import React, { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DashboardCard from "../../Components/DashboardCard";
import Divider from "../../Components/Divider";
import Loader from "../../Components/Loader";
import { Button, Modal } from "react-bootstrap";
import Pdf from "react-to-pdf";
// import RoundButton from "../Components/RoundButton";
import {
  getTeacherExam,
  submitStudentMarks,
} from "../../Store/Actions/ExamActions";

// const ref = createRef();

const TeacherExamPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const id = useLocation().pathname.split("/")[2];
  const [exam, setExam] = useState(null);
  const [qExpanded, setQExpanded] = useState(false);
  const [aExpanded, setAExpanded] = useState(false);
  const [attemptModal, setAttemptModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);

  const dispatch = useDispatch();

  const { teacherAccess } = useSelector((state) => state.users);

  const showAttemptModal = (attempt) => {
    setCurrentAttempt(attempt);
    setAttemptModal(true);
  };

  const submitMarks = async (marks, id) => {
    const data = await dispatch(submitStudentMarks(marks, id, exam._id));
    if (!data.error) {
      setExam(data);
    }
    setAttemptModal(false);
  };

  console.log(exam);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const exam1 = await dispatch(getTeacherExam(id));
      if (!exam1.error) {
        setExam(exam1);
      } else {
        setError(exam1.error);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      {resultModal && (
        <ResultModal
          exam={exam}
          show={resultModal}
          onHide={() => setResultModal(false)}
        />
      )}
      {attemptModal && (
        <AttemptModal
          show={attemptModal}
          onHide={() => setAttemptModal(false)}
          exam={exam}
          attempt={currentAttempt}
          submit={submitMarks}
        />
      )}
      {loading ? (
        <Loader msg="Loading Exam" />
      ) : exam ? (
        <>
          <div
            className="p-text"
            style={{
              width: "100%",
              padding: "20px 0px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="p-text fccs">
              <span style={{ fontWeight: 500 }}>{exam.title}</span>
              <span style={{ fontWeight: 500, fontFamily: "monospace" }}>
                {exam.code}
              </span>
            </div>
            <div className="p-text">
              {teacherAccess === 2 && (
                <Button
                  onClick={() => setResultModal(true)}
                  disabled={
                    exam.attempts.length === 0 ||
                    exam.attempts.filter((a) => a.marked === false).length > 0
                  }
                >
                  Result
                </Button>
              )}
            </div>
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
              <div
                className="p-text"
                style={{ fontWeight: 550, marginLeft: 3 }}
              >
                {exam.subject}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="p-text">Grade: </div>
              <div
                className="p-text"
                style={{ fontWeight: 550, marginLeft: 3 }}
              >
                {exam.grade}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="p-text">Syllabus: </div>
              <div
                className="p-text"
                style={{ fontWeight: 550, marginLeft: 3 }}
              >
                {exam.syllabus}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="p-text">Duration: </div>
              <div
                className="p-text"
                style={{ fontWeight: 550, marginLeft: 3 }}
              >
                {exam.duration} mins
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
            <h6 className="p-text">Questions</h6>
            <div onClick={() => setQExpanded(!qExpanded)}>
              {qExpanded ? (
                <RiArrowDropUpLine color="#888" size={24} />
              ) : (
                <RiArrowDropDownLine color="#888" size={24} />
              )}
            </div>
          </div>
          {qExpanded && (
            <div style={{ width: "100%", marginTop: 10 }}>
              {exam.questions.length > 0 ? (
                exam.questions.map((question, index) => (
                  <QuestionCard key={index} question={question} />
                ))
              ) : (
                <div className="p-text" style={{ textAlign: "center" }}>
                  No Question
                </div>
              )}
            </div>
          )}
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
            <h6 className="p-text">Attempts</h6>
            <div onClick={() => setAExpanded(!aExpanded)}>
              {aExpanded ? (
                <RiArrowDropUpLine color="#888" size={24} />
              ) : (
                <RiArrowDropDownLine color="#888" size={24} />
              )}
            </div>
          </div>
          {aExpanded && (
            <div style={{ width: "100%", marginTop: 10 }}>
              {exam.attempts.length > 0 ? (
                exam.attempts.map((attempt, index) => (
                  <>
                    <AttemptCard
                      key={index}
                      attempt={attempt}
                      onClick={() => showAttemptModal(attempt)}
                    />
                  </>
                ))
              ) : (
                <div className="p-text" style={{ textAlign: "center" }}>
                  No Attempts
                </div>
              )}
            </div>
          )}
          <Divider />
        </>
      ) : (
        <div className="p-text" style={{ textAlign: "center", marginTop: 10 }}>
          {error}
        </div>
      )}
    </div>
  );
};

const QuestionCard = ({ question }) => {
  const [expanded, setExpanded] = useState(false);
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
                height: 200,
                width: "fit-content",
                padding: 6,
                background: "#ddd",
                borderRadius: 3,
              }}
            >
              <a href={question.image} target="_blank" rel="noreferrer">
                <img
                  src={question.image}
                  style={{ height: "100%" }}
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
              {question.type} - Marks:{question.marks}
            </div>
          </div>
        </>
      ) : null}
    </DashboardCard>
  );
};

const AttemptCard = ({ attempt, onClick }) => {
  return (
    <DashboardCard>
      <div
        className="p-text"
        onClick={onClick}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>{attempt.student.name}</div>
        {attempt.marked ? <div>Marked</div> : <div>Unmarked</div>}
      </div>
    </DashboardCard>
  );
};

const AttemptModal = ({ show, onHide, attempt, exam, submit }) => {
  // console.log(exam.questions);
  // console.log(attempt.answers);
  const [marks, setMarks] = useState(
    exam.questions.map(
      (q) => attempt.answers.find((a) => a.qId === q._id.toString()).scoredMarks
    )
  );
  const updateMarks = (m, i) => {
    let updatedMarks = [...marks];
    if (m > attempt.answers[i].maxMarks) {
      updatedMarks[i] = attempt.answers[i].maxMarks;
    } else if (m < 0) {
      updatedMarks[i] = 0;
    } else {
      updatedMarks[i] = +m;
    }
    setMarks(updatedMarks);
  };
  const submitMarks = () => {
    submit(marks, attempt.student.id);
  };
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h5 className="p-text">{attempt.student.name}</h5>
          {attempt.answers.filter((a) => a.result === null).length > 0 ? (
            <Button
              onClick={submitMarks}
              disabled={marks.filter((a) => a === null).length > 0}
            >
              Submit Marks
            </Button>
          ) : (
            <div>Marks Submitted</div>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="p-text">
          {exam.questions.map((q, i) => {
            console.log(attempt.answers);
            let currentAnswer = attempt.answers.find(
              (a) => q._id.toString() === a.qId.toString()
            );
            return (
              <DashboardCard>
                <div>{q.statement}</div>
                {q.image !== null && (
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
                    <a href={q.image} target="_blank" rel="noreferrer">
                      <img
                        src={q.image}
                        style={{ maxHeight: 200, maxWidth: "100%" }}
                        alt="question-img"
                      />
                    </a>
                  </div>
                )}
                <Divider />
                <div>Answer: {currentAnswer.answer}</div>
                <Divider />
                <div style={{ textAlign: "right" }}>
                  Marks:{" "}
                  {currentAnswer.result === null ? (
                    <input
                      className="mark-input-001"
                      type="number"
                      style={{ width: 30, textAlign: "center" }}
                      value={marks[i]}
                      onChange={(e) => updateMarks(e.target.value, i)}
                    />
                  ) : (
                    <span>{marks[i]}</span>
                  )}{" "}
                  out of {currentAnswer.maxMarks}
                </div>
              </DashboardCard>
            );
          })}
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

const ResultModal = ({ show, onHide, exam }) => {
  const ref = useRef();
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>Result</Modal.Header>
      <Modal.Body>
        <div ref={ref} className="w-100">
          <table className="w-100">
            <tr>
              <th>Name</th>
              <th>Marks</th>
              <th>Percentage</th>
            </tr>

            {exam.attempts
              .sort((a, b) =>
                a.answers.reduce((a, b) => a + b.scoredMarks, 0) <
                b.answers.reduce((a, b) => a + b.scoredMarks, 0)
                  ? 1
                  : -1
              )
              .map((a, i) => (
                <tr key={i}>
                  <td>{a.student.name}</td>
                  <td>
                    {a.answers.reduce((a, b) => a + b.scoredMarks, 0)}/
                    {a.answers.reduce((a, b) => a + b.maxMarks, 0)}
                  </td>
                  <td>
                    {(
                      (a.answers.reduce((a, b) => a + b.scoredMarks, 0) /
                        a.answers.reduce((a, b) => a + b.maxMarks, 0)) *
                      100
                    ).toFixed(2)}{" "}
                    %
                  </td>
                </tr>
              ))}
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="frcc w-100">
          <Button onClick={onHide} variant="secondary" block>
            Cancel
          </Button>
          <Pdf targetRef={ref} filename="result.pdf" x={10} y={10}>
            {({ toPdf }) => (
              <Button block onClick={toPdf} className="ml-1 mt-0">
                Save PDF
              </Button>
            )}
          </Pdf>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
export default TeacherExamPage;
