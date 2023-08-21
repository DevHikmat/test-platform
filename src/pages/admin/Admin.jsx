import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Image, Layout, Menu, theme } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { QuizService } from "../../services/QuizService";
import { UserService } from "../../services/UserService";
import { CategoryService } from "../../services/CategoryService";
import { getAllUsersStart, getAllUsersSuccess } from "../../redux/userSlice";
import logo from "../../static/images/logo1.png";
import CategoryBox from "../../components/CategoryBox/CategoryBox";
import QuizBox from "../../components/QuizBox/QuizBox";
import GroupsBox from "../../components/GroupBox/GroupBox";
import { getQuizStart, getQuizSuccess } from "../../redux/quizSlice";
import {
  getAllCategoryStart,
  getAllCategorySuccess,
} from "../../redux/categorySlice";
import CategoryView from "../../components/CategoryBox/CategoryView";
import QuizView from "../../components/QuizBox/QuizView";
import { authLogout } from "../../redux/authSlice";
import Profile from "../../components/Profile/Profile";
import StudentBox from "../../components/StudentBox/StudentBox";
import StudentInfoBox from "../../components/StudentBox/StudentInfoBox";
import TeacherBox from "../../components/TeacherBox/TeacherBox";
import TeacherView from "../../components/TeacherBox/TeacherView";
import TeacherGrStudents from "../../components/TeacherBox/TeacherGrStudents";
const { Header, Sider, Content } = Layout;

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.auth);
  const { isChange } = useSelector((state) => state.users);
  const quizList = useSelector((state) => state.quiz);
  const { category } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleAllUsers = async () => {
    dispatch(getAllUsersStart());
    try {
      let data = await UserService.getAllUsers();
      data = data.filter((user) => user.role !== "admin");
      dispatch(getAllUsersSuccess(data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAllQuiz = async () => {
    dispatch(getQuizStart());
    try {
      const data = await QuizService.getAllQuiz();
      dispatch(getQuizSuccess(data.quizzes));
    } catch (error) {
      console.log(error);
    }
  };
  const handleAllCategory = async () => {
    dispatch(getAllCategoryStart());
    try {
      const data = await CategoryService.getAllCategory();
      dispatch(getAllCategorySuccess(data.categories));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    dispatch(authLogout());
    navigate("/login");
  };

  useEffect(() => {
    toggleSiderMenu();
  }, []);

  useEffect(() => {
    handleAllCategory();
  }, [category.isChange]);

  useEffect(() => {
    handleAllQuiz();
  }, [quizList.isChange]);

  useEffect(() => {
    handleAllUsers();
  }, [isChange]);

  const toggleSiderMenu = () => {
    window.innerWidth <= 576 && setCollapsed(true);
  };

  const adminItems = [
    {
      key: "1",
      icon: <i className="fa-solid fa-server"></i>,
      label: (
        <Link
          to=""
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Kategoriya
        </Link>
      ),
      url: "",
    },
    {
      key: "2",
      icon: <i className="fa-solid fa-book"></i>,
      label: (
        <Link
          to="quiz"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Imtihonlar
        </Link>
      ),
      url: "/quiz",
    },
    {
      key: "3",
      icon: <i className="fa-solid fa-layer-group"></i>,
      label: (
        <Link
          to="groups"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Guruhlar
        </Link>
      ),
      url: "/groups",
    },
    {
      key: "4",
      icon: <i className="fa-solid fa-user-group"></i>,
      label: (
        <Link
          to="students"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          O'quvchilar
        </Link>
      ),
      url: "/students",
    },
    {
      key: "5",
      icon: <i className="fa-solid fa-graduation-cap"></i>,
      label: (
        <Link
          to="teachers"
          onClick={toggleSiderMenu}
          style={{ textDecoration: "none" }}
        >
          Ustozlar
        </Link>
      ),
      url: "/teachers",
    },
  ];
  return (
    <div className="admin">
      <Layout>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "white" }}
          className="shadow"
        >
          <div className="demo-logo-vertical">
            <Link to="/admin" className="logo-box">
              <img src={logo} alt="logo" className="img-fluid rounded-circle" />
            </Link>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[
              String(
                adminItems.findIndex(
                  (item) => "/admin" + item.url === location.pathname
                ) + 1
              ),
            ]}
            items={[
              ...adminItems,
              {
                key: "6",
                icon: <i className="fa-solid fa-arrow-right-from-bracket"></i>,
                label: (
                  <div onClick={handleLogout} className="logout-box">
                    Profildan chiqish
                  </div>
                ),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header className="shadow-sm">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div className="user-title">
              <div className="d-flex align-items-center gap-2">
                <Link to="profile" className="profile-link">
                  <div className="user-title-avatar">
                    {currentUser?.profilePicture ? (
                      <Image
                        preview={false}
                        src={currentUser.profilePicture.url}
                      />
                    ) : (
                      <Image
                        preview={false}
                        src="error"
                        fallback="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
                      />
                    )}
                  </div>
                  <h4>
                    {currentUser?.firstname} {currentUser?.lastname}
                  </h4>
                </Link>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Routes>
              <Route path="/" element={<CategoryBox collapsed={collapsed} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/category/:id" element={<CategoryView />} />
              <Route path="/quiz" element={<QuizBox />} />
              <Route path="/quiz/:id" element={<QuizView />} />
              <Route path="/groups" element={<GroupsBox />} />
              <Route path="/students" element={<StudentBox />} />
              <Route path="/students/:id" element={<StudentInfoBox />} />
              <Route path="/teachers" element={<TeacherBox />} />
              <Route path="/teachers/:id" element={<TeacherView />} />
              <Route path="/teachers/:id/:id" element={<TeacherGrStudents />} />
              <Route
                path="/teachers/:id/:id/:id"
                element={<StudentInfoBox />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
export default Admin;
