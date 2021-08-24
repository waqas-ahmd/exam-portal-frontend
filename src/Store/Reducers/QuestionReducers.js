import {
  CREATE_QUESTION,
  DELETE_QUESTION,
  FILTER_QUESTIONS,
  GET_QUESTIONS,
  UPDATE_QUESTION,
} from "../Actions/QuestionActions";

const initialState = {
  userQuestions: [],
  filteredQuestions: [],
  filters: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  let retrievedQuestionData = null;
  switch (action.type) {
    case CREATE_QUESTION:
      retrievedQuestionData = action.data;
      return {
        ...state,
        userQuestions: [retrievedQuestionData, ...state.userQuestions],
        filteredQuestions: [retrievedQuestionData, ...state.filteredQuestions],
      };
    case GET_QUESTIONS:
      retrievedQuestionData = action.data;
      return {
        ...state,
        userQuestions: retrievedQuestionData,
        filteredQuestions: retrievedQuestionData,
      };

    case FILTER_QUESTIONS:
      retrievedQuestionData = action.data;
      return {
        ...state,
        filteredQuestions: retrievedQuestionData,
        filters: action.filters,
      };

    case UPDATE_QUESTION:
      let updatedQuestion = action.data;
      let updatedQuestions = [...state.userQuestions].filter(
        (q) => q._id !== updatedQuestion._id
      );
      let updatedFilteredQuestions = [...state.filteredQuestions].filter(
        (q) => q._id !== updatedQuestion._id
      );
      updatedQuestions = [updatedQuestion, ...updatedQuestions];
      updatedFilteredQuestions = [updatedQuestion, ...updatedFilteredQuestions];

      return {
        ...state,
        userQuestions: updatedQuestions,
        filteredQuestions: updatedFilteredQuestions,
      };

    case DELETE_QUESTION:
      return state;
    default:
      return state;
  }
};
