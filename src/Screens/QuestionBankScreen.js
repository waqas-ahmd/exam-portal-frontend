import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import RoundButton from "../Components/RoundButton";
import RoundInput from "../Components/RoundInput";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import DashboardCard from "../Components/DashboardCard";
import { isEmpty } from "../utils/validation";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { TiDeleteOutline } from "react-icons/ti";
import {
  createQuestion,
  deleteQuestion,
  filterQuestions,
  getQuestions,
  googleFormQuestions,
  updateQuestion,
} from "../Store/Actions/QuestionActions";
import Loader from "../Components/Loader";
import {
  grades,
  optionTags,
  questionTypes,
  subjects,
  syllabuses,
  withAll,
} from "../Data/DataArrays";
import { useLocation } from "react-router-dom";
import { parse } from "query-string";
import axios from "axios";
import { baseUrl } from "../utils/constants";

const QuestionBankScreen = () => {
  const { search } = useLocation();
  const paramFilters = parse(search);

  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [googleFormModal, setGoogleFormModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filters, setFilters] = useState({
    subject: paramFilters.subject || "All",
    grade: paramFilters.grade || "All",
    syllabus: paramFilters.syllabus || "All",
  });
  const questionsList = useSelector(
    ({ questions }) => questions.filteredQuestions
  );
  const access = useSelector((state) => state.users.teacherAccess);
  const dispatch = useDispatch();

  const handleAddQuestion = () => {
    setAddModal(true);
  };

  const handleEdit = (id) => {
    setEditModal(true);
    setSelectedQuestion(id);
  };

  const handleRemove = (id) => {
    setDeleteModal(true);
    setSelectedQuestion(id);
  };

  const confirmDelete = async () => {
    setDeleteModal(false);
    const deleted = await dispatch(deleteQuestion(selectedQuestion));
    if (deleted) {
      await dispatch(getQuestions());
      dispatch(filterQuestions(filters));
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await dispatch(getQuestions());
      dispatch(filterQuestions(paramFilters));
      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(filterQuestions(filters));
  }, [dispatch, filters]);

  return (
    <div className="flex1 fcsc">
      {deleteModal && (
        <DeleteModal
          show={deleteModal}
          onHide={() => setDeleteModal(false)}
          confirm={confirmDelete}
        />
      )}

      {addModal && (
        <AddQuestionModal
          access={access}
          show={addModal}
          onHide={() => setAddModal(false)}
          question={{
            grade: filters.grade,
            subject: filters.subject,
            syllabus: filters.syllabus,
          }}
        />
      )}

      {googleFormModal && (
        <GoogleFormModal
          show={googleFormModal}
          onHide={() => setGoogleFormModal(false)}
        />
      )}

      {editModal && (
        <AddQuestionModal
          show={editModal}
          onHide={() => setEditModal(false)}
          edit={true}
          question={questionsList.filter((q) => q._id === selectedQuestion)[0]}
        />
      )}
      <div style={{ margin: "20px auto" }}>
        <h4 className="p-text" style={{ fontWeight: "bold" }}>
          Question Bank
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
              <select
                defaultValue={filters.subject}
                onChange={(e) =>
                  setFilters({ ...filters, subject: e.currentTarget.value })
                }
              >
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
              <select
                defaultValue={filters.grade}
                onChange={(e) =>
                  setFilters({ ...filters, grade: e.currentTarget.value })
                }
              >
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
              <select
                defaultValue={filters.syllabus}
                onChange={(e) =>
                  setFilters({ ...filters, syllabus: e.currentTarget.value })
                }
              >
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
          Questions List
        </div>
        <div>
          <RoundButton
            onClick={handleAddQuestion}
            style={{ padding: "3px", width: 250, marginBottom: 10 }}
          >
            Add New
          </RoundButton>
          <RoundButton
            onClick={() => setGoogleFormModal(true)}
            style={{ padding: "3px", width: 250 }}
          >
            Add From Google Forms
          </RoundButton>
        </div>
      </div>
      <div style={{ width: "100%", marginTop: 10 }}>
        {loading ? (
          <Loader msg="Loading Questions.." />
        ) : questionsList.length > 0 ? (
          questionsList.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              edit={handleEdit}
              remove={handleRemove}
            />
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#f73" }}>
            No Questions Found
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard = ({ question, edit, remove }) => {
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
            onClick={() => edit(question._id)}
            style={{
              cursor: "pointer",
              margin: "0px 8px",
            }}
          >
            <MdEdit color="#66f" size={20} />
          </div>
          <div
            onClick={() => remove(question._id)}
            style={{
              cursor: "pointer",
              margin: "0px 8px",
            }}
          >
            <MdDeleteForever color="#f44" size={20} />
          </div>
          <div
            onClick={() => setExpanded(!expanded)}
            style={{
              cursor: "pointer",
            }}
          >
            {expanded ? (
              <RiArrowDropUpLine color="#888" size={28} />
            ) : (
              <RiArrowDropDownLine color="#888" size={28} />
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

const modalErrorsInitial = {
  statement: false,
  choices: [false, false, false, false, false],
};

const AddQuestionModal = ({ show, onHide, edit, question, access }) => {
  const [page, setPage] = useState(edit ? 2 : 1);
  const [syllabus, setSyllabus] = useState(
    question.syllabus !== "All" ? question.syllabus : "Local"
  );
  const [grade, setGrade] = useState(
    question.grade !== "All" ? question.grade : "1"
  );
  const [subject, setSubject] = useState(
    question.subject !== "All" ? question.subject : "English"
  );
  const [type, setType] = useState(
    question.type ? question.type : "Short Question"
  );
  const [statement, setStatement] = useState(
    question.statement ? question.statement : ""
  );
  const [image, setImage] = useState(question.image ? question.image : null);
  const [choices, setChoices] = useState(
    question.choices ? question.choices : ["", "", "", "", ""]
  );
  const [correctChoice, setCorrectChoice] = useState(
    question.correctChoice ? question.correctChoice : 0
  );
  const [isFormValid, setFormValid] = useState(true);
  const [formErrors, setFormErrors] = useState(modalErrorsInitial);
  const [forceValidation, setForceValidation] = useState(false);

  const dispatch = useDispatch();

  const modifyChoices = (value, index) => {
    let newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    // setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": " multipart/form-data",
        },
      };

      const { data } = await axios.post(
        `${baseUrl()}/api/upload`,
        formData,
        config
      );
      setImage(`${baseUrl()}${data}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }

    if (image === null && statement === "") {
      return;
    }

    await dispatch(
      updateQuestion({
        id: question._id,
        subject,
        statement,
        type,
        choices: type === "Short Question" ? null : choices,
        correctChoice: type === "Short Question" ? null : correctChoice,
        grade,
        syllabus,
        image,
      })
    );
    onHide();
  };

  const handleSubmitQuestion = async () => {
    if (!isFormValid) {
      if (!forceValidation) setForceValidation(true);
      return;
    }

    await dispatch(
      createQuestion({
        subject,
        statement: statement === "" ? "See Image" : statement,
        type,
        choices: type === "Short Question" ? null : choices,
        correctChoice: type === "Short Question" ? null : correctChoice,
        grade,
        syllabus,
        image,
      })
    );
    setStatement("");
    setChoices(["", "", "", "", ""]);
    setImage(null);
    onHide();
  };

  useEffect(() => {
    let newFormErrors = {
      statement: false,
      choices: [false, false, false, false, false],
    };
    let formError = true;

    // if (isEmpty(statement)) {
    //   newFormErrors.statement = "REQUIRED";
    //   formError = false;
    // }
    if (type === "Multiple Choice") {
      choices.forEach((choice, index) => {
        if (isEmpty(choice)) {
          newFormErrors.choices[index] = "REQUIRED";
          formError = false;
        }
      });
    }

    setFormErrors(newFormErrors);
    setFormValid(formError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choices, statement, type]);

  return (
    <Modal backdrop="static" centered show={show} onHide={onHide}>
      <Modal.Header>
        <div className="p-text">Add Question</div>
      </Modal.Header>
      <Modal.Body>
        {page === 1 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 0px",
              }}
            >
              <div className="p-text" style={{ marginRight: 5 }}>
                Subject
              </div>

              <RoundInput style={{ width: 200, padding: "3px 10px" }}>
                <select
                  onChange={(e) => setSubject(e.currentTarget.value)}
                  value={subject}
                >
                  {subjects.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </RoundInput>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 0px",
              }}
            >
              <div className="p-text" style={{ marginRight: 5 }}>
                Grade
              </div>
              <RoundInput style={{ width: 200, padding: "3px 10px" }}>
                <select
                  onChange={(e) => setGrade(e.currentTarget.value)}
                  value={grade}
                >
                  {grades.map((grade, index) => (
                    <option key={index} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </RoundInput>
            </div>
            {access !== 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 0px",
                }}
              >
                <div className="p-text" style={{ marginRight: 5 }}>
                  Syllabus
                </div>
                <RoundInput style={{ width: 200, padding: "3px 10px" }}>
                  <select
                    onChange={(e) => setSyllabus(e.currentTarget.value)}
                    value={syllabus}
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
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "5px 0px",
              }}
            >
              <div className="p-text" style={{ marginRight: 5 }}>
                Question Type
              </div>
              <RoundInput style={{ width: 200, padding: "3px 10px" }}>
                <select
                  onChange={(e) => setType(e.currentTarget.value)}
                  value={type}
                >
                  {questionTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </RoundInput>
            </div>
          </div>
        ) : null}
        {page === 2 ? (
          <>
            <div
              className="p-text"
              style={{ marginBottom: 10 }}
            >{`${subject} - ${grade} - ${syllabus} `}</div>
            {type === "Short Question" ? (
              <div style={{ margin: "auto" }}>
                <RoundInput
                  validation={{
                    value: formErrors.statement,
                    force: forceValidation,
                  }}
                  style={{ borderRadius: 5 }}
                >
                  <textarea
                    placeholder="Enter Question Statement"
                    type="text"
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    rows={5}
                  />
                </RoundInput>
                <RoundInput
                  style={{
                    borderRadius: 5,
                    marginTop: 5,
                    position: "relative",
                  }}
                >
                  {image === null ? (
                    <>
                      <div className="p-text">Upload Image (if Required)</div>
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        multiple={false}
                        accept="image/*"
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={image}
                        style={{ width: "100%", borderRadius: 4 }}
                        alt="uploaded-img"
                      />
                      <div
                        onClick={() => setImage(null)}
                        style={{ position: "absolute", top: 10, right: 20 }}
                      >
                        <TiDeleteOutline color="#f33" size={28} />
                      </div>
                    </>
                  )}
                </RoundInput>
              </div>
            ) : (
              <div style={{ margin: "auto" }}>
                <RoundInput
                  validation={{ value: formErrors.statement }}
                  style={{ borderRadius: 5 }}
                >
                  <textarea
                    placeholder="Enter Question Statement"
                    type="text"
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    rows={2}
                  />
                </RoundInput>
                <div>
                  {choices.map((choice, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <div
                        onClick={() => setCorrectChoice(index)}
                        style={{
                          position: "relative",
                          cursor: "pointer",
                          width: 32,
                          height: 32,
                          borderRadius: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 5,
                          border: "2px solid #888",
                          backgroundColor:
                            correctChoice === index ? "#0f0" : "#ccc",
                          // backgroundColor: "transparent",
                        }}
                      >
                        {optionTags[index]}
                      </div>
                      <RoundInput
                        validation={{
                          value: formErrors.choices[index],
                          force: forceValidation,
                        }}
                        style={{ padding: "4px 10px", flex: 1 }}
                      >
                        <input
                          style={{ fontSize: "small" }}
                          placeholder={`Option ${optionTags[index]}`}
                          value={choice}
                          onChange={(e) => modifyChoices(e.target.value, index)}
                        />
                      </RoundInput>
                    </div>
                  ))}
                  <RoundInput
                    style={{
                      borderRadius: 5,
                      marginTop: 5,
                      position: "relative",
                    }}
                  >
                    {image === null ? (
                      <>
                        <div className="p-text">Upload Image (if Required)</div>
                        <input
                          type="file"
                          onChange={uploadFileHandler}
                          multiple={false}
                          accept="image/*"
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={image}
                          style={{ width: "100%", borderRadius: 4 }}
                          alt="uploaded-img"
                        />
                        <div
                          onClick={() => setImage(null)}
                          style={{ position: "absolute", top: 10, right: 20 }}
                        >
                          <TiDeleteOutline color="#f33" size={28} />
                        </div>
                      </>
                    )}
                  </RoundInput>
                </div>
              </div>
            )}
          </>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "auto",
            marginTop: 10,
          }}
        >
          {page > 1 ? (
            <RoundButton
              onClick={() => setPage((page) => page - 1)}
              style={{ width: 120, padding: "3px 5px" }}
            >
              Back
            </RoundButton>
          ) : (
            <div></div>
          )}
          {page === 1 ? (
            <RoundButton
              onClick={() => setPage((page) => page + 1)}
              style={{ width: 120, padding: "3px 5px" }}
            >
              Next
            </RoundButton>
          ) : edit ? (
            <RoundButton
              onClick={handleUpdateQuestion}
              style={{ width: 120, padding: "3px 5px" }}
            >
              Update
            </RoundButton>
          ) : (
            <RoundButton
              onClick={handleSubmitQuestion}
              style={{ width: 120, padding: "3px 5px" }}
            >
              Submit
            </RoundButton>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" block onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const DeleteModal = ({ show, onHide, confirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header>
        <h5 className="p-text">Delete Question</h5>
      </Modal.Header>
      <Modal.Body>
        <div className="p-text">
          This Action is Permanent! <br />
          Do you Really Want to Delete This Question ?
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

const GoogleFormModal = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const [link, setLink] = useState("");

  const handleFetch = async () => {
    const data = await dispatch(googleFormQuestions(link));
    if (data.questions) {
      console.log(data.questions);
      for (let i = 0; i < data.questions.length; i++) {
        await dispatch(
          createQuestion({
            subject: "Other",
            statement: data.questions[i].statement,
            type: data.questions[i].type,
            choices: data.questions[i].choices,
            correctChoice: data.questions[i].correctChoice,
            grade: "Other",
            syllabus: "Other",
            image: null,
          })
        );
      }
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

export default QuestionBankScreen;
