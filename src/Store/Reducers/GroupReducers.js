import {
  ADD_STUDENT_GROUP,
  CREATE_GROUP,
  GET_STUDENT_GROUPS,
  GET_TEACHER_GROUPS,
} from "../Actions/GroupActions";

const initialState = {
  teacherGroups: [],
  studentGroups: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TEACHER_GROUPS:
      return { ...state, teacherGroups: action.data };
    case GET_STUDENT_GROUPS:
      return { ...state, studentGroups: action.data };
    case CREATE_GROUP:
      return {
        ...state,
        teacherGroups: [action.data, ...state.teacherGroups],
      };
    case ADD_STUDENT_GROUP:
      return {
        ...state,
        studentGroups: [action.data, ...state.studentGroups],
      };
    default:
      return state;
  }
};
