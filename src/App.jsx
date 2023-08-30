import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GroupService } from "./services/GroupService";
import { UserService } from "./services/UserService";
import {
  getGroupsSuccess,
  changeGroupStart,
  changeGroupFailure,
} from "./redux/groupSlice";
import {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
} from "./redux/authSlice";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Student from "./pages/student/Student";
import Admin from "./pages/admin/Admin";
import Teacher from "./pages/teacher/Teacher";
import { setAxiosInstanceToken } from "./services/axiosInstance";
import { message } from "antd";

function App() {
  const { auth, groups, quiz } = useSelector((state) => state);
  const { isLogin } = auth;
  const { isChange } = groups;
  const { isFinished } = quiz;

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [protectedRoute, setProtectedRoute] = useState(null);
  let adminRoute = [{ path: "/admin/*", element: <Admin /> }];
  let teacherRoute = [{ path: "/teacher/*", element: <Teacher /> }];
  let studentRoute = [{ path: "/student/*", element: <Student /> }];

  const handleGroups = async () => {
    dispatch(changeGroupStart());
    try {
      const data = await GroupService.getAllGroups();
      dispatch(getGroupsSuccess(data.groups));
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeGroupFailure());
    }
  };

  const getCurrentUser = async (token) => {
    setAxiosInstanceToken(token);
    dispatch(authChangeStart());
    const id = localStorage.getItem("id");
    try {
      const data = await UserService.getOneUser(id);
      if (data.role === "admin") {
        setProtectedRoute(adminRoute);
        !location.pathname.startsWith("/admin") && navigate("/admin");
      } else if (data.role === "teacher") {
        setProtectedRoute(teacherRoute);
        !location.pathname.startsWith("/teacher") && navigate("/teacher");
      } else if (data.role === "student") {
        setProtectedRoute(studentRoute);
        !location.pathname.startsWith("/student") && navigate("/student");
      }
      dispatch(authChangeSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(authChangeFailure());
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getCurrentUser(token);
    else navigate("/login");
  }, [isLogin, isFinished]);

  useEffect(() => {
    handleGroups();
  }, [isChange]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {protectedRoute?.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
