import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment/moment";
import {
  deleteUserStart,
  getAllUsersSuccess,
  getOneUserFailure,
  getOneUserStart,
  getOneUserSuccess,
  getTeacherGroupFailure,
  getTeacherGroupStart,
  getTeacherGroupSuccess,
} from "../../redux/userSlice";
import { UserService } from "../../services/UserService";
import { GroupService } from "../../services/GroupService";
import { Col, Divider, Popconfirm, Row, Skeleton } from "antd";
import { toast } from "react-toastify";

const TeacherView = () => {
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.users);
  const [teacher, setTeacher] = useState(null);
  const [groups, setGroups] = useState(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleGetTeacher = async () => {
    dispatch(getOneUserStart());
    try {
      const data = await UserService.getOneUser(id);
      setTeacher(data);
      dispatch(getOneUserSuccess());
    } catch (error) {
      dispatch(getOneUserFailure());
    }
  };

  const handleTeacherGroups = async () => {
    dispatch(getTeacherGroupStart());
    try {
      const data = await GroupService.getTeacherGroups(id);
      setGroups(data.groups);
      dispatch(getTeacherGroupSuccess());
    } catch (error) {
      console.log(error);
      dispatch(getTeacherGroupFailure());
    }
  };

  const handleDeleteTeacher = async () => {
    dispatch(deleteUserStart());
    try {
      await UserService.deleteUser(teacher._id);
      const data = await UserService.getAllUsers();
      dispatch(getAllUsersSuccess(data));
      toast.success("Ustoz o'chirildi!");
      navigate("/admin/teachers/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetTeacher();
    handleTeacherGroups();
  }, [id]);
  return (
    <div className="teacher-view">
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={6} xl={6} xxl={6}>
            {teacher && (
              <div className="teacher-card shadow rounded">
                <img
                  className="card-img-top"
                  src={
                    teacher.profilePicture
                      ? teacher.profilePicture.url
                      : "https://schoolknot.com/website/img/bg-img/default.png"
                  }
                  alt="teacher-img"
                />
                <div className="card-body">
                  <figure>
                    <blockquote>
                      <h6>
                        {teacher.firstname} {teacher.lastname}
                      </h6>
                    </blockquote>
                    <div className="blockquote-footer">{teacher.email}</div>
                  </figure>
                  <p className="text-muted">Frontend mentor</p>
                  <Popconfirm
                    title={
                      teacher.firstname +
                      " haqidagi barcha ma'lumotlar o'chib ketsinmi?"
                    }
                    okText="o'chirish"
                    okType="danger"
                    cancelText="bekor"
                    onConfirm={handleDeleteTeacher}
                  >
                    <p style={{ cursor: "pointer" }} className="text-danger">
                      Ustozni o'chirish
                    </p>
                  </Popconfirm>
                </div>
              </div>
            )}
          </Col>
          <Col xs={24} sm={24} md={12} lg={18} xl={18} xxl={18}>
            <Divider orientation="left">Tegishli guruhlar</Divider>
            <div className="own-group">
              {groups && groups.length > 0
                ? groups.map((group, index) => {
                    return (
                      <Link to={`${group._id}`} key={index}>
                        <div className="own-group-item card-body rounded shadow mb-3">
                          <h6>{group.name}</h6>
                          <div className="d-flex gap-3">
                            <p className="text-muted">Ochilgan sanasi: </p>
                            <p>
                              {moment(group.createdAt).format("DD-MM-YYYY")} yil
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                : "Guruhlar mavjud emas!"}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default TeacherView;
