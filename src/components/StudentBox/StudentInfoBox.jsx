import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Switch, Button, Popconfirm, Image } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
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
      dispatch(updateUserSuccess());
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getViewUser();
  }, [id, isChange]);
  return (
    <div className="user-info-box">
      <div className="row">
        <div className="col-4">
          <div className="d-flex flex-wrap gap-3">
            {viewUser?.profilePicture ? (
              <Image
                width={100}
                height={100}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                src={viewUser.profilePicture.url}
              />
            ) : (
              <Avatar shape="square" size={100} icon={<UserOutlined />} />
            )}
            <div className="d-flex flex-column h-100 pt-3">
              <h4 className="mb-0">
                {viewUser?.firstname} {viewUser?.lastname}
              </h4>
              <p style={{ color: "#909090" }}>{viewUser?.email}</p>
            </div>
          </div>
        </div>
        <div className="col border-start">
          <div className="d-flex justify-content-around">
            <div className="d-flex pt-3 align-items-start flex-column h-100">
              <h5>Imtihonga ruxsat</h5>
              {viewUser && (
                <Switch
                  checkedChildren="Ha"
                  unCheckedChildren="Yo'q"
                  defaultChecked={viewUser.accessExam}
                  onChange={() => toggleExamChange(viewUser.accessExam)}
                />
              )}
            </div>
            <Popconfirm
              title="Rostdanham bu o'quvchi o'chirilsinmi?"
              okText="ha"
              cancelText="yo'q"
              okType="danger"
            >
              <Button className="mt-3" danger icon={<DeleteOutlined />} />
            </Popconfirm>
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
