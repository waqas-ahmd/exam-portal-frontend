import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./Store/Actions/UserActions";
import PublicRoute from "./Components/PublicRoute";
import AdminRoute from "./Components/AdminRoute";
import UserOnlyRoute from "./Components/UserOnlyRoute";
import DashboardScreen from "./Screens/Dashboard/DashboardScreen";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ExamListScreen from "./Screens/ExamList/ExamListScreen";
import QuestionBankScreen from "./Screens/QuestionBankScreen";
import CreateExamQuestionsScreen from "./Screens/CreateExamQuestionsScreen";
import CreateExamSettingsScreen from "./Screens/CreateExamSettingsScreen";
import ExamPageScreen from "./Screens/ExamPage/ExamPageScreen";
import TeacherTutorial from "./Screens/Tutorial/TeacherTutorial";
import StudentTutorial from "./Screens/Tutorial/StudentTutorial";
import ForgetPasswordScreen from "./Screens/ForgetPasswordScreen";
import ResetPasswordScreen from "./Screens/ResetPasswordScreen";
import UpdateProfileScreen from "./Screens/UpdateProfileScreen";
import GroupListScreen from "./Screens/GroupList/GroupListScreen";
import GroupScreen from "./Screens/GroupPage/GroupScreen";
import TeachersListScreen from "./Screens/Admin/TeachersListScreen";
import StudentsListScreen from "./Screens/Admin/StudentsListScreen";
import ResetPasswordWithLinkScreen from "./Screens/ResetPasswordWithLinkScreen";
import ChatScreen from "./Screens/Admin/ChatScreen";

function App() {
  const dispatch = useDispatch();
  dispatch(loadUser());

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <PublicRoute path="/login" element={<LoginScreen />} />
      <PublicRoute path="/register" element={<RegisterScreen />} />
      <PublicRoute path="/tutorial/Teacher" element={<TeacherTutorial />} />
      <PublicRoute path="/tutorial/Student" element={<StudentTutorial />} />
      <PublicRoute path="/forget" element={<ForgetPasswordScreen />} />
      <PublicRoute
        path="/resetPasswordRequest"
        element={<ResetPasswordWithLinkScreen />}
      />
      <UserOnlyRoute path="/dashboard" element={<DashboardScreen />} />
      <UserOnlyRoute path="/reset" element={<ResetPasswordScreen />} />
      <UserOnlyRoute path="/updateProfile" element={<UpdateProfileScreen />} />
      <UserOnlyRoute path="/questions" element={<QuestionBankScreen />} />
      <UserOnlyRoute path="/exam/:id" element={<ExamPageScreen />} />
      <UserOnlyRoute path="/exams" element={<ExamListScreen />} />
      <UserOnlyRoute path="/groups" element={<GroupListScreen />} />
      <UserOnlyRoute path="/group/:id" element={<GroupScreen />} />
      <AdminRoute path="/teachers" element={<TeachersListScreen />} />
      <AdminRoute path="/students" element={<StudentsListScreen />} />
      <AdminRoute path="/chat" element={<ChatScreen />} />
      <UserOnlyRoute
        path="/create-exam/settings"
        element={<CreateExamSettingsScreen />}
      />
      <UserOnlyRoute
        path="/create-exam/questions"
        element={<CreateExamQuestionsScreen />}
      />
    </Routes>
  );
}

export default App;
