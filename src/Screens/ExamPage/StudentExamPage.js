/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Divider from "../../Components/Divider";
import Loader from "../../Components/Loader";
import {
  getExamQuestions,
  getResult,
  getStudentExam,
  submitExam,
} from "../../Store/Actions/ExamActions";
import { Button } from "react-bootstrap";
import { getMinutes, getSeconds } from "../../utils/time";
import DashboardCard from "../../Components/DashboardCard";
import RoundInput from "../../Components/RoundInput";
import RoundButton from "../../Components/RoundButton";

const StudentExamPage = () => {
  const dispatch = useDispatch();
  const id = useLocation().pathname.split("/")[2];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [exam, setExam] = useState(null);
  const [isAttempting, setAttempting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [timerDuration, setTimerDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [transition, setTransition] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [result, setResult] = useState(0);
  const [pages, setPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [examDate, setExamDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleStartWaitTimer = (t) => {
    setWaitTime(t);
    setTimerDuration(t);
    setStartTime(Date.now());
    setWaiting(true);
  };

  const startExamTimer = (t) => {
    setWaitTime(t);
    setTimerDuration(t);
    setStartTime(Date.now());
    setAttempting(true);
  };

  const cancelWait = () => {
    setWaiting(false);
  };

  const loadExam = useCallback(async () => {
    const data = await dispatch(getExamQuestions(exam._id));
    if (!data.error) {
      setQuestions(data.questions);
      console.log(data.questions);
      setPages(Math.ceil(data.questions.length / 10));
      setCurrentPage(1);
      let answers = [];
      data.questions.forEach((q) => {
        answers.push({ id: q._id, value: null });
      });
      setAnswers(answers);
      startExamTimer(exam.duration * 60 * 1000);
    }

    setTransition(false);
  }, [dispatch, exam]);

  const handleSubmitExam = async () => {
    const result = await dispatch(submitExam(answers, exam._id));
    if (!result.error) {
      setAttempting(false);
      setCorrect(result.filter((r) => r.result === true && r.isMcq).length);
      setIncorrect(result.filter((r) => r.result === false && r.isMcq).length);
      setSuccess(true);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const exam1 = await dispatch(getStudentExam(id));
      if (!exam1.error) {
        setExam(exam1);
        setExamDate(new Date(exam1.publishTime));
        if (exam1.attempted) {
          const resultData = await dispatch(getResult(exam1._id));
          let overallResult = 0;
          resultData.forEach((r) => {
            if (r.scoredMarks === null) {
              overallResult = null;
              return;
            }
          });
          if (overallResult === 0) {
            let scoredMarks = resultData.reduce((a, b) => a + b.scoredMarks, 0);
            let maxMarks = resultData.reduce((a, b) => a + b.maxMarks, 0);
            overallResult = { scoredMarks, maxMarks };
          }
          setResult(overallResult);
          setCorrect(
            resultData.filter((r) => r.result === true && r.isMcq).length
          );
          setIncorrect(
            resultData.filter((r) => r.result === false && r.isMcq).length
          );
          setSuccess(true);
        }
      } else {
        setError(exam1.error);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    var waitTimer = null;
    (async () => {
      if (waiting || isAttempting) {
        if (isAttempting && waitTime <= 0) {
          const result = await dispatch(submitExam(answers, exam._id));
          if (!result.error) {
            setAttempting(false);
            setCorrect(result.filter((r) => r.result === true).length);
            setIncorrect(result.filter((r) => r.result === false).length);
            setSuccess(true);
          }
        }
        if (waitTime <= 0) {
          setWaiting(false);
          setTransition(true);
          await loadExam();
          return;
        }
        waitTimer = setInterval(() => {
          const diff = timerDuration - (Date.now() - startTime);
          setWaitTime(diff);
        }, 100);
      }
    })();

    return () => clearInterval(waitTimer);
  }, [
    waitTime,
    waiting,
    loadExam,
    startTime,
    timerDuration,
    isAttempting,
    dispatch,
    answers,
    exam,
  ]);

  return (
    <div className="fcsc flex1">
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
            <div className="p-text">
              Title: <span style={{ fontWeight: 500 }}>{exam.title}</span>
            </div>
            {isAttempting && (
              <div
                className="p-text"
                style={{
                  position: "fixed",
                  bottom: "0%",
                  right: 0,
                  textAlign: "center",
                  padding: 8,
                  background: waitTime < 60000 ? "#d44" : "#44d",
                  fontSize: "small",
                  zIndex: 100,
                  color: "white",
                  letterSpacing: 1,
                  borderTopLeftRadius: 5,
                }}
              >
                TIME LEFT
                <br /> {getMinutes(waitTime)}:{getSeconds(waitTime)}
              </div>
            )}
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
          <Divider style={{ marginBottom: 30 }} />
          {success && (
            <div
              className="p-text"
              style={{
                textAlign: "left",
                width: 300,
                padding: 20,
                border: "1px solid #888",
              }}
            >
              <div className="p-text mb-3">Exam Submitted Successfully</div>
              <Divider />
              <h6>MCQs Result:</h6>
              <div>Total: {correct + incorrect}</div>
              <div>Correct: {correct}</div>
              <div>Incorrect: {incorrect}</div>
              <Divider />
              <h6>Overall Result:</h6>
              {result ? (
                <>
                  <div>
                    Marks: {result.scoredMarks} / {result.maxMarks}
                  </div>
                  <div>
                    Percentage :
                    {((result.scoredMarks / result.maxMarks) * 100).toFixed(2)}%
                  </div>
                </>
              ) : (
                <>
                  <div>Result not Available</div>
                </>
              )}
            </div>
          )}
          {!success &&
            !transition &&
            !isAttempting &&
            !waiting &&
            !exam.attempted && (
              <div style={{ textAlign: "center" }}>
                <div className="p-text mb-3">
                  {examDate.toISOString() < currentDate.toISOString()
                    ? "This Exam is Available to Attempt"
                    : `The Exam is schduled on ${examDate.toLocaleString()}`}
                </div>
                {examDate.toISOString() < currentDate.toISOString() && (
                  <Button onClick={() => handleStartWaitTimer(5000)}>
                    Start Exam
                  </Button>
                )}
              </div>
            )}
          {!isAttempting && waiting && (
            <div style={{ textAlign: "center" }}>
              <div className="p-text mb-3">
                Exam will Start in {getSeconds(waitTime)} seconds
              </div>
              <div>
                <Button onClick={cancelWait}>Cancel</Button>
              </div>
            </div>
          )}
          {isAttempting && (
            <>
              <div style={{ width: "100%" }}>
                {questions
                  .filter(
                    (q, i) =>
                      i < currentPage * 10 && i >= (currentPage - 1) * 10
                  )
                  .map((q, i) => (
                    <QuestionCard
                      key={i}
                      question={q}
                      answers={answers}
                      setAnswers={setAnswers}
                      index={i}
                    />
                  ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 100,
                  width: "100%",
                }}
              >
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous Page
                </Button>
                <div>
                  Page {currentPage} of {pages}
                </div>
                {currentPage === pages ? (
                  <Button onClick={handleSubmitExam}>Submit Exam</Button>
                ) : (
                  <Button onClick={() => setCurrentPage((p) => p + 1)}>
                    Next Page
                  </Button>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="p-text" style={{ textAlign: "center" }}>
          {error}
        </div>
      )}
    </div>
  );
};

const QuestionCard = ({ question, index, answers, setAnswers }) => {
  const updateAnswers = (answer) => {
    let updatedAnswers = [...answers];
    updatedAnswers[index].value = answer;
    setAnswers(updatedAnswers);
  };
  return (
    <>
      <DashboardCard>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ width: "100%", marginBottom: 10 }} className="p-text">
            {question.statement}
          </div>
          {question.image && (
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
          {question.type === "Short Question" && (
            <RoundInput
              style={{
                borderRadius: 5,
                width: "100%",
                backgroundColor: "#eef",
              }}
            >
              <textarea
                value={answers[index].value}
                onChange={(e) => updateAnswers(e.target.value)}
                placeholder="Write Your Answer Here"
                rows={4}
              />
            </RoundInput>
          )}
          {question.type === "Multiple Choice" &&
            question.choices.map((c, i) => (
              <RoundButton
                style={{
                  minWidth: 300,
                  marginBottom: 8,
                  padding: "2px 5px",
                  backgroundColor: "#eee",
                  border: "2px solid transparent",
                  borderColor:
                    c === answers[index].value ? "#393" : "transparent",
                }}
                onClick={() => updateAnswers(c)}
              >
                {c}
              </RoundButton>
            ))}
        </div>
      </DashboardCard>
    </>
  );
};

export default StudentExamPage;
