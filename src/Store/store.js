import ReduxThunk from "redux-thunk";
import { applyMiddleware, combineReducers, createStore } from "redux";
import UserReducers from "./Reducers/UserReducers";
import QuestionReducers from "./Reducers/QuestionReducers";
import ExamReducers from "./Reducers/ExamReducers";
import GroupReducers from "./Reducers/GroupReducers";

const rootReducer = combineReducers({
  users: UserReducers,
  questions: QuestionReducers,
  exams: ExamReducers,
  groups: GroupReducers,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
