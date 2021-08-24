import axios from "axios";
import { baseUrl } from "../../utils/constants";
import io from "socket.io-client";

export const UPDATE_USER = "UPDATE_USER";
export const LOAD_USER = "LOAD_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const GET_NOTIFICATIONS = "GET_NOTIFICATIONS";
export const UPDATE_SOCKET = "UPDATE_SOCKET";
export const SET_TEACHER_ACCESS = "SET_TEACHER_ACCESS";
export const SET_USER_ACCESS = "SET_USER_ACCESS";

export const loadUser = () => {
  return async (dispatch) => {
    const data = localStorage.getItem("epUserData")
      ? JSON.parse(localStorage.getItem("epUserData"))
      : null;
    dispatch({ type: LOAD_USER, data });
  };
};

export const registerUser = (requestData) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/users/register`,
      requestData,
      config
    );
    if (!data.error) {
      dispatch({ type: UPDATE_USER, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const loginUser = (requestData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/users/login`,
        requestData,
        config
      );
      if (!data.error) {
        dispatch({ type: UPDATE_USER, data });
        return data;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  };
};

export const loginUserWithGoogle = (requestData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/users/googlesignin`,
        requestData,
        config
      );
      if (!data.error) {
        dispatch({ type: UPDATE_USER, data });
        return data;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  };
};

export const registerUserWithGoogle = (requestData) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/users/googlesignup`,
        requestData,
        config
      );
      if (!data.error) {
        dispatch({ type: UPDATE_USER, data });
        return data;
      } else {
        return data;
      }
    } catch (error) {
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: LOGOUT_USER });
  };
};

export const forgetPassword = (email) => async (dispatch) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/users/forgetPassword`,
      { email },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = (password) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/users/resetPassword`,
      { password },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordWithLink =
  (secret, id, password) => async (dispatch, getState) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/users/resetPasswordRequest`,
        { secret, id, password },
        config
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

export const updateProfile = (reqData) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/users/update`,
      reqData,
      config
    );
    if (!data.error) {
      dispatch({ type: UPDATE_USER, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const getAllTeachers = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/users/teachers`, config);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllStudents = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/users/students`, config);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getNotifications = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/users/notifications`,
      config
    );
    if (!data.error) {
      dispatch({ type: GET_NOTIFICATIONS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const readNotifications = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/users/notifications`,
      null,
      config
    );
    if (!data.error) {
      dispatch({ type: GET_NOTIFICATIONS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    throw error;
  }
};

export const connectSocket = () => async (dispatch, getState) => {
  const userId = getState().users.userData._id;

  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
    query: { userId },
  };
  const ENDPOINT = baseUrl();
  try {
    const socket = io.connect(ENDPOINT, connectionOptions);
    dispatch({ type: UPDATE_SOCKET, socket });
  } catch (error) {
    throw error;
  }
};

export const updateTeacherAccess =
  (teacherId, accessCode) => async (dispatch, getState) => {
    const { userData } = getState().users;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.put(
        `${baseUrl()}/api/users/updateTeacherAccess`,
        { teacherId, accessCode },
        config
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

export const getTeacherAccessCode = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/users/getTeacherAccessCode`,
      config
    );
    if (!data.error) {
      dispatch({ type: SET_TEACHER_ACCESS, data });
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getUserAccess = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/users/userAccess`,
      config
    );
    if (!data.error) {
      dispatch({ type: SET_USER_ACCESS, data });
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendMessage = (message) => async (dispatch, getState) => {
  const { socket } = getState().users;
  try {
    socket.emit("sendMessageToAdmin", { message });
  } catch (error) {
    throw error;
  }
};

export const getAdminMessages = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/users/chat`, config);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllAdminMessages = () => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/users/adminChats`,
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const adminReply = (message, userId) => async (dispatch, getState) => {
  const { socket } = getState().users;
  try {
    socket.emit("adminReply", { message, userId });
  } catch (error) {
    throw error;
  }
};

export const readAdminChat = (userId) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/users/readAdminChat`,
      { userId },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const blockUser = (userId) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/users/block`,
      { userId },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const unblockUser = (userId) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/users/unblock`,
      { userId },
      config
    );
    return data;
  } catch (error) {
    throw error;
  }
};
