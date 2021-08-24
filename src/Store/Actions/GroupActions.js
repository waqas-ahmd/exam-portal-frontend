import axios from "axios";
import { baseUrl } from "../../utils/constants";

export const CREATE_GROUP = "CREATE_GROUP";
export const GET_TEACHER_GROUPS = "GET_TEACHER_GROUPS";
export const ADD_STUDENT_GROUP = "ADD_STUDENT_GROUP";
export const GET_STUDENT_GROUPS = "GET_STUDENT_GROUPS";

export const createGroup =
  (title, feeAmount, feeDuration, freeTrail) => async (dispatch, getState) => {
    const { userData } = getState().users;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/groups/create`,
        { title, feeAmount, feeDuration, freeTrail },
        config
      );
      if (!data.error) {
        dispatch({ type: CREATE_GROUP, data });
        return data;
      } else {
        return data;
      }
    } catch (error) {
      return { error: "Action Failed" };
    }
  };

export const getTeacherGroups = () => async (dispatch, getState) => {
  const { userData } = getState().users;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/groups/teacher`, config);
    if (!data.error) {
      dispatch({ type: GET_TEACHER_GROUPS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const joinGroupRequest = (code) => async (dispatch, getState) => {
  const { userData } = getState().users;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${baseUrl()}/api/groups/join`,
      { code },
      config
    );
    if (!data.error) {
      dispatch({ type: ADD_STUDENT_GROUP, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getStudentGroups = () => async (dispatch, getState) => {
  const { userData } = getState().users;

  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(`${baseUrl()}/api/groups/student`, config);
    if (!data.error) {
      dispatch({ type: GET_STUDENT_GROUPS, data });
      return data;
    } else {
      return data;
    }
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getTeacherGroupById = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/groups/teacher/${id}`,
      config
    );
    return data;
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const getStudentGroupById = (id) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.get(
      `${baseUrl()}/api/groups/student/${id}`,
      config
    );
    return data;
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const addAnnouncement =
  (title, body, id) => async (dispatch, getState) => {
    const { userData, socket } = getState().users;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/groups/announcement/${id}`,
        { title, body },
        config
      );
      if (!data.error) {
        socket.emit("groupAnnouncement", {
          groupId: id,
        });
      }
      return data;
    } catch (error) {
      return { error: "Action Failed" };
    }
  };

export const updateMember =
  (memberId, action, id) => async (dispatch, getState) => {
    const { userData } = getState().users;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
      };
      const { data } = await axios.post(
        `${baseUrl()}/api/groups/member/${id}`,
        { memberId, action },
        config
      );
      return data;
    } catch (error) {
      return { error: "Action Failed" };
    }
  };

export const removeAnnouncement = (id, msgId) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/groups/announcement/${id}`,
      { msgId },
      config
    );

    return data;
  } catch (error) {
    return { error: "Action Failed" };
  }
};

export const updatePayment = (groupId) => async (dispatch, getState) => {
  const { userData } = getState().users;
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.put(
      `${baseUrl()}/api/groups/payment/${groupId}`,
      null,
      config
    );

    return data;
  } catch (error) {
    return { error: "Action Failed" };
  }
};