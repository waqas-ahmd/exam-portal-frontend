import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const CREATE_EXAM = "CREATE_EXAM";
export const GET_TEACHER_EXAMS = "GET_TEACHER_EXAMS";
export const UPDATE_STUDENT_EXAMS = "UPDATE_STUDENT_EXAMS";
export const GET_STUDENT_EXAMS = "GET_STUDENT_EXAMS";

export const createExam = (requestData) => async (dispatch, getState) => {
  const { userData } = getState().users;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/exams/create`,
      requestData,
      config
    );
    if (!data.error) {
      dispatch({ type: CREATE_EXAM, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getTeacherExams = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/exams/teacher`, config);
    if (!data.error) {
      dispatch({ type: GET_TEACHER_EXAMS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getTeacherExam = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/exams/teacher/${id}`,
      config
    );
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const deleteTeacherExam = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.delete(
      `${baseUrl()}/api/exams/teacher/${id}`,
      config
    );
    if (!data.error) {
      dispatch({ type: GET_TEACHER_EXAMS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const updateStudentExams = (code) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/exams/student/`,
      { code },
      config
    );
    if (!data.error) {
      dispatch({ type: UPDATE_STUDENT_EXAMS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getStudentExams = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/exams/student/`, config);
    if (!data.error) {
      dispatch({ type: GET_STUDENT_EXAMS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getStudentExam = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/exams/student/${id}`,
      config
    );
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getExamQuestions = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/exams/questions/${id}`,
      config
    );
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const submitExam = (answers, id) => async (dispatch, getState) => {
  const { userData, socket } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/exams/submit/${id}`,
      { answers },
      config
    );
    if (!data.error) {
      socket.emit("examSubmitted", { examId: id });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getResult = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/exams/result/${id}`,
      config
    );
    if (!data.error) {
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const submitStudentMarks =
  (studentMarks, studentId, id) => async (dispatch, getState) => {
    const { userData } = getState().users;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/exams/marks/${id}`,
        { studentId, studentMarks },
        config
      );
      if (!data.error) {
        return data;
      } else {
        return data;
      }
    } catch (error) {
      return { error: "Action Failed" };
    }
  };
