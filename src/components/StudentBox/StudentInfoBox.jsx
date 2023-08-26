import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Switch, Image, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { UserService } from "../../services/UserService";
import { updateUserStart, updateUserSuccess } from "../../redux/userSlice";
import HistoryBox from "../HistoryBox/HistoryBox";
import "./StudentInfoBox.scss";

const StudentInfoBox = () => {
  const dispatch = useDispatch();
  const [viewUser, setViewUser] = useState(null);
  const { id } = useParams();
  const { isChange } = useSelector((state) => state.users);

  const getViewUser = async () => {
    try {
      const data = await UserService.getOneUser(id);
      setViewUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleExamChange = async (accessExam) => {
    dispatch(updateUserStart());
    try {
      await UserService.updateUser(id, {
        accessExam: !accessExam,
      });
      message.success("Ruxsat o'zgardi");
      dispatch(updateUserSuccess());
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getViewUser();
  }, [id, isChange]);
  return (
    <div className="user-info-box">
      <div className="row">
        <div className="col-4">
          <div className="d-flex flex-wrap align-items-center gap-3">
            {viewUser?.profilePicture ? (
              <Image
                width={60}
                height={60}
                style={{ objectFit: "cover", borderRadius: "50%" }}
                src={viewUser.profilePicture.url}
              />
            ) : (
              <Avatar shape="circle" size={60} icon={<UserOutlined />} />
            )}
            <div className="">
              <h6 className="mb-0">
                {viewUser?.firstname} {viewUser?.lastname}
              </h6>
              <p style={{ color: "#909090", marginBottom: "0" }}>
                {viewUser?.email}
              </p>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="d-flex align-items-center h-100 gap-3">
            <strong>Imtihonga ruxsat</strong>
            {viewUser && (
              <Switch
                checkedChildren="Ha"
                unCheckedChildren="Yo'q"
                defaultChecked={viewUser.accessExam}
                onChange={() => toggleExamChange(viewUser.accessExam)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="user-history">
        <HistoryBox />
      </div>
    </div>
  );
};

export default StudentInfoBox;
