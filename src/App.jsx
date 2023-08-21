import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GroupService } from "./services/GroupService";
import { UserService } from "./services/UserService";
import {
  getGroupsStart,
  getGroupsSuccess,
  getGroupsFailure,
} from "./redux/groupSlice";
import {
  authUserStart,
  authUserSuccess,
  authUserFailure,
} from "./redux/authSlice";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Student from "./pages/student/Student";
import Admin from "./pages/admin/Admin";
import Teacher from "./pages/teacher/Teacher";
import { setAxiosInstanceToken } from "./services/axiosInstance";

function App() {
  const { isLogin } = useSelector((state) => state.auth);
  const { isChange } = useSelector((state) => state.groups);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [protectedRoute, setProtectedRoute] = useState(null);
  let adminRoute = [{ path: "/admin/*", element: <Admin /> }];
  let teacherRoute = [{ path: "/teacher/*", element: <Teacher /> }];
  let studentRoute = [{ path: "/student/*", element: <Student /> }];

  const handleGroups = async () => {
    dispatch(getGroupsStart());
    try {
      const data = await GroupService.getAllGroups();
      dispatch(getGroupsSuccess(data.groups));
    } catch (error) {
      dispatch(getGroupsFailure(error.response.data.message));
    }
  };

  const getCurrentUser = async (token) => {
    setAxiosInstanceToken(token);
    dispatch(authUserStart());
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
      dispatch(authUserSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(authUserFailure());
      navigate("/login");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getCurrentUser(token);
    else navigate("/login");
  }, [isLogin]);

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
