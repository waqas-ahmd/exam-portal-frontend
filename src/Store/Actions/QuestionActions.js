import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const CREATE_QUESTION = "CREATE_QUESTION";
export const UPDATE_QUESTION = "UPDATE_QUESTION";
export const GET_QUESTIONS = "GET_QUESTIONS";
export const FILTER_QUESTIONS = "FILTER_QUESTIONS";
export const DELETE_QUESTION = "DELETE_QUESTION";

const filterFunction = (data, filters) => {
  Object.keys(filters).forEach((key, index) => {
    if (filters[key] !== "All") {
      data = data.filter((q) => q[key] === filters[key]);
    }
  });
  return data;
};

export const createQuestion = (requestData) => async (dispatch, getState) => {
  const { userData } = getState().users;
  const { filters } = getState().questions;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/questions/create`,
      requestData,
      config
    );
    if (!data.error) {
      dispatch({ type: CREATE_QUESTION, data });
      const { userQuestions } = getState().questions;
      const filteredData = filterFunction(userQuestions, filters);
      dispatch({ type: FILTER_QUESTIONS, data: filteredData, filters });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const updateQuestion = (requestData) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    console.log("dispatching");
    const { data } = await axios.put(
      `${baseUrl()}/api/questions/update`,
      requestData,
      config
    );
    if (!data.error) {
      dispatch({ type: UPDATE_QUESTION, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const getQuestions = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/questions/`, config);
    if (!data.error) {
      dispatch({ type: GET_QUESTIONS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const filterQuestions = (filters) => async (dispatch, getState) => {
  const { userQuestions } = getState().questions;
  let filteredQuestions = filterFunction([...userQuestions], filters);
  dispatch({ type: FILTER_QUESTIONS, data: filteredQuestions, filters });
};

export const deleteQuestion = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.delete(
      `${baseUrl()}/api/questions/delete/${id}`,
      config
    );
    if (!data.error) {
      dispatch({ type: DELETE_QUESTION, data });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const googleFormQuestions = (link) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/questions/googleForm`,
      { link },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};
