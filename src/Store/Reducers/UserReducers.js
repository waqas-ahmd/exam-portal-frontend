import {
  UPDATE_USER,
  LOAD_USER,
  LOGOUT_USER,
  GET_NOTIFICATIONS,
  UPDATE_SOCKET,
  SET_TEACHER_ACCESS,
  SET_USER_ACCESS,
} from "../Actions/UserActions";

const initialState = {
  userData: null,
  notifications: [],
  socket: null,
  teacherAccess: 0,
  userBlocked: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_USER:
      return { ...state, userData: action.data };
    case LOGOUT_USER:
      localStorage.removeItem("epUserData");
      return { ...state, userData: null };
    case UPDATE_USER:
      localStorage.setItem("epUserData", JSON.stringify(action.data));
      return { ...state, userData: action.data };
    case GET_NOTIFICATIONS:
      return { ...state, notifications: action.data };
    case UPDATE_SOCKET:
      return { ...state, socket: action.socket };
    case SET_TEACHER_ACCESS:
      return { ...state, teacherAccess: action.data };
    case SET_USER_ACCESS:
      return { ...state, userBlocked: action.data };
    default:
      return state;
  }
};
