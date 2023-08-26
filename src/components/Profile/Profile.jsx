import { Button, Form, Image, Input, Modal } from "antd";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SettingOutlined } from "@ant-design/icons";
import "./Profile.scss";
import {
  authUpdateFailure,
  authUpdateStart,
  authUpdateSuccess,
} from "../../redux/authSlice";
import { UserService } from "../../services/UserService";
import HistoryBox from "../HistoryBox/HistoryBox";

const Profile = () => {
  const [form] = Form.useForm();
  const { currentUser, isLoading } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.groups);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadImage = async (e) => {
    dispatch(authUpdateStart());
    try {
      let formData = new FormData();
      formData.append("profilePicture", e.target.files[0]);
      currentUser.profilePicture &&
        formData.append("public_id", currentUser.profilePicture.public_id);
      const data = await UserService.updateUser(currentUser._id, formData);
      console.log(data);
      dispatch(authUpdateSuccess(data));
    } catch (error) {
      console.log(error);
      dispatch(authUpdateFailure());
    }
  };

  const handleUpdateUser = async () => {
    dispatch(authUpdateStart());
    const userInfo = form.getFieldsValue();
    let updatedInfo;
    if (userInfo.password) {
      updatedInfo = userInfo;
    } else {
      const { firstname, lastname, email } = userInfo;
      updatedInfo = { firstname, lastname, email };
    }
    try {
      const data = await UserService.updateUser(currentUser._id, updatedInfo);
      dispatch(authUpdateSuccess(data));
      setIsModalOpen(false);
    } catch (error) {
      dispatch(authUpdateFailure());
    }
  };

  return (
    <div className="profile">
      <div className="avatar-box">
        <div className="avatar-box-img">
          {currentUser?.profilePicture ? (
            <Image alt="Profile image" src={currentUser.profilePicture.url} />
          ) : (
            <Image
              src="error"
              fallback="https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png"
            />
          )}
          <input
            accept="image/*"
            onChange={(e) => handleUploadImage(e)}
            id="avatar"
            type="file"
            className="d-none"
          />
          {!isLoading ? (
            <label htmlFor="avatar" className="fa-solid fa-pen"></label>
          ) : (
            <label className="fa-solid fa-spinner"></label>
          )}
        </div>
        <div className="avatar-box-info">
          <div className="d-flex align-items-start direction-sm-column flex-wrap gap-3">
            <div>
              <h5>
                {currentUser.firstname} {currentUser.lastname}
              </h5>
              <span className="text-muted">{currentUser.email}</span>
            </div>
            <div>
              {currentUser.role === "teacher" ? (
                <h6 className="text-primary fs-2">
                  <i className="fa-solid fa-user-graduate"></i>
                </h6>
              ) : (
                ""
              )}
            </div>
          </div>
          {currentUser.role === "student" && (
            <h6>
              Guruh:{" "}
              {groups?.find((item) => item._id === currentUser.group)?.name}
            </h6>
          )}
        </div>
      </div>
      <div className="change-info-box">
        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<SettingOutlined />}
          className="px-0 d-flex align-items-center"
          type="link"
        >
          Ma'lumotlarni o'zgartirish
        </Button>
        <Modal
          onCancel={() => setIsModalOpen(false)}
          title="Shaxsiy malumotlar"
          open={isModalOpen}
          footer={false}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              firstname: currentUser.firstname,
              lastname: currentUser.lastname,
              email: currentUser.email,
              group: groups?.find((item) => item._id === currentUser.group)
                ?._id,
            }}
          >
            <Form.Item
              name="firstname"
              label="Ism"
              rules={[
                {
                  required: true,
                  message: "maydonni to'ldiring",
                },
              ]}
            >
              <Input placeholder="Ism" />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Familya"
              rules={[
                {
                  required: true,
                  message: "maydonni to'ldiring",
                },
              ]}
            >
              <Input placeholder="Familya" />
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  required: true,
                  message: "maydonni to'ldiring",
                },
              ]}
            >
              <Input placeholder="E-mail" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Yangi parol(Yangilash kerak bo'lmasa shart emas)"
            >
              <Input placeholder="Yangi parol kiriting" />
            </Form.Item>
            <Form.Item>
              <Button
                loading={isLoading}
                type="primary"
                onClick={handleUpdateUser}
              >
                Yangilash
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <HistoryBox />
    </div>
  );
};

export default memo(Profile);
