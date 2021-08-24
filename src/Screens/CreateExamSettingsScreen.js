import { parse } from "query-string";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";

import { subjects, grades, syllabuses } from "../Data/DataArrays";
import { isBetween, isEmpty } from "../utils/validation";
const formErrorsInitial = {
  title: false,
  duration: false,
};
const CreateExamSettingsScreen = () => {
  const { search } = useLocation();
  const groupId = parse(search).group || null;
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState(grades[0]);
  const [syllabus, setSyllabus] = useState(syllabuses[0]);
  const [duration, setDuration] = useState(0);
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState(formErrorsInitial);
  const [forceValidation, setForceValidation] = useState(false);

  const access = useSelector((state) => state.users.teacherAccess);

  const navigate = useNavigate();
  const handleNextPage = () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }
    if (groupId) {
      navigate(`/create-exam/questions?group=${groupId}`, {
        state: { title, subject, grade, syllabus, duration: +duration },
      });
    } else {
      navigate("/create-exam/questions", {
        state: { title, subject, grade, syllabus, duration: +duration },
      });
    }
  };

  useEffect(() => {
    let newFormErrors = { ...formErrorsInitial };
    let formError = true;
    if (isEmpty(title)) {
      newFormErrors.title = "REQUIRED";
      formError = false;
    }
    if (isBetween(+duration, 10, 180)) {
      newFormErrors.duration = "VALUE SHOULD BE BETWEEN 10 and 180";
      formError = false;
    }

    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, title]);

  return (
    <div className="fcsc flex1">
      <div style={{ margin: "20px auto" }}>
        <h4 className="p-text" style={{ fontWeight: "bold" }}>
          Create New Exam
        </h4>
      </div>

      <div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ marginLeft: 15, fontSize: "small" }} className="p-text">
            Enter Title
          </div>
          <RoundInput
            validation={{
              force: forceValidation,
              value: formErrors.title,
            }}
            style={{ width: 320 }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </RoundInput>
        </div>
        {access !== 0 && (
          <div style={{ marginBottom: 10 }}>
            <div
              style={{ marginLeft: 15, fontSize: "small" }}
              className="p-text"
            >
              Select Syllabus
            </div>
            <RoundInput style={{ width: 320 }}>
              <select
                value={syllabus}
                onChange={(e) => setSyllabus(e.currentTarget.value)}
              >
                {syllabuses.map((syllabus, index) => (
                  <option key={index} value={syllabus}>
                    {syllabus}
                  </option>
                ))}
              </select>
            </RoundInput>
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <div style={{ marginLeft: 15, fontSize: "small" }} className="p-text">
            Select Grade
          </div>
          <RoundInput style={{ width: 320 }}>
            <select
              value={grade}
              onChange={(e) => setGrade(e.currentTarget.value)}
            >
              {grades.map((grade, index) => (
                <option key={index} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </RoundInput>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ marginLeft: 15, fontSize: "small" }} className="p-text">
            Select Subject
          </div>
          <RoundInput style={{ width: 320 }}>
            <select
              value={subject}
              onChange={(e) => setSubject(e.currentTarget.value)}
            >
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </RoundInput>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ marginLeft: 15, fontSize: "small" }} className="p-text">
            Enter Test Duration (mins)
          </div>
          <RoundInput
            validation={{
              force: forceValidation,
              value: formErrors.duration,
            }}
            style={{ width: 320 }}
          >
            <input
              value={duration}
              onChange={(e) => setDuration(e.currentTarget.value)}
              type="number"
            />
          </RoundInput>
        </div>
      </div>
      <div onClick={handleNextPage}>
        <RoundButton style={{ marginTop: 20, width: 320 }}>Next</RoundButton>
      </div>
    </div>
  );
};

export default CreateExamSettingsScreen;
