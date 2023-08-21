import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { message } from "antd";
import { AuthService } from "../../services/AuthService";
import {
  authUserStart,
  authUserSuccess,
  authUserFailure,
} from "../../redux/authSlice";
import "./Login.scss";
import { setAxiosInstanceToken } from "../../services/axiosInstance";

const Login = () => {
  const { isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const email_rf = useRef();
  const passw_rf = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(authUserStart());
    try {
      const data = await AuthService.login({
        email: email_rf.current.value,
        password: passw_rf.current.value,
      });
      localStorage.setItem("id", data.user._id);
      localStorage.setItem("token", data.token);
      setAxiosInstanceToken(data.token);
      dispatch(authUserSuccess(data.user));
      message.success(`Salom ${data.user.firstname}!`);
    } catch (error) {
      dispatch(authUserFailure());
      toast.error("Bu foydalanuvchi topilmadi!");
    }
  };
  return (
    <div className="login">
      <div className="login-content shadow">
        <div className="login-content-left">
          <img src="./images/logo/logo1.png" alt="logo" />
        </div>
        <div className="login-content-right">
          <h3>Login</h3>
          <form onSubmit={(e) => handleLogin(e)}>
            <div className="input-box mb-3">
              <label className="fa-solid fa-envelope"></label>
              <input
                ref={email_rf}
                type="email"
                className="shadow"
                placeholder="E-mail"
                required
              />
            </div>
            <div className="input-box mb-3">
              <label className="fa-solid fa-lock"></label>
              <input
                ref={passw_rf}
                type="password"
                className="shadow"
                placeholder="parol"
                required
              />
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="login-btn mb-2"
            >
              login
            </button>
            <div>
              <Link to="/signup">Or register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
