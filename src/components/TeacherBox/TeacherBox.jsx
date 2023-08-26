import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  message,
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "../../services/AuthService";
import { UserService } from "../../services/UserService";
import { getAllUsersStart, getAllUsersSuccess } from "../../redux/userSlice";
import TeacherItem from "./TeacherItem";
import "./TeacherBox.scss";
import { PlusOutlined } from "@ant-design/icons";

const TeacherBox = () => {
  const dispatch = useDispatch();
  const { teacherList } = useSelector((state) => state.users);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddTeacher = async (values) => {
    try {
      await AuthService.signup({ ...values, role: "teacher" });
      dispatch(getAllUsersStart());
      const users = await UserService.getAllUsers();
      dispatch(getAllUsersSuccess(users));
      setOpen(false);
      message.success("Ustoz qo'shildi");
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="teacher-box">
      <div className="d-flex justify-content-end">
        <Button
          className="teacher-add-btn"
          onClick={() => setOpen(true)}
          icon={<PlusOutlined />}
        />
      </div>
      <Drawer
        title="Ustoz ma'lumotlari"
        onClose={() => setOpen(false)}
        placement="right"
        open={open}
      >
        <Form
          onFinish={handleAddTeacher}
          form={form}
          labelAlign="left"
          labelCol={{
            span: 7,
          }}
        >
          <Form.Item
            name="subject"
            label="Fan nomi"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input placeholder="Fan nomini kiriting" />
          </Form.Item>
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
            <Input placeholder="ism" />
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
            <Input placeholder="familya" />
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
            <Input placeholder="e-mail" type="email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[
              {
                required: true,
                message: "maydonni to'ldiring",
              },
            ]}
          >
            <Input.Password placeholder="parol" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Yaratish</Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Divider>Barcha ustozlar</Divider>
      <Row gutter={24}>
        {teacherList?.map((teach, index) => {
          return <TeacherItem key={index} teach={teach} />;
        })}
      </Row>
    </div>
  );
};

export default TeacherBox;
