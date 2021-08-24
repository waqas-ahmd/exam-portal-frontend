import {
  CREATE_EXAM,
  GET_STUDENT_EXAMS,
  GET_TEACHER_EXAMS,
  UPDATE_STUDENT_EXAMS,
} from "../Actions/ExamActions";

const initialState = {
  teacherExams: [],
  studentExams: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  let retrievedExamData = null;
  switch (action.type) {
    case CREATE_EXAM:
      retrievedExamData = action.data;
      return {
        ...state,
        teacherExams: [retrievedExamData, ...state.teacherExams],
      };
    case GET_TEACHER_EXAMS:
      retrievedExamData = action.data;
      return {
        ...state,
        teacherExams: [...retrievedExamData],
      };
    case GET_STUDENT_EXAMS:
      retrievedExamData = action.data;
      return {
        ...state,
        studentExams: [...retrievedExamData],
      };

    case UPDATE_STUDENT_EXAMS:
      retrievedExamData = action.data;
      return {
        ...state,
        studentExams: [retrievedExamData, ...state.studentExams],
      };
    default:
      return state;
  }
};
