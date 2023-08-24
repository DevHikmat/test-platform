import { Button, Divider, Form, Input, Modal, Row } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthService } from "../../services/AuthService";
import { UserService } from "../../services/UserService";
import { getAllUsersStart, getAllUsersSuccess } from "../../redux/userSlice";
import TeacherItem from "./TeacherItem";
import { toast } from "react-toastify";
import "./TeacherBox.scss";

const TeacherBox = () => {
  const dispatch = useDispatch();
  const { teacherList } = useSelector((state) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddTeacher = async (values) => {
    try {
      await AuthService.signup({ ...values, role: "teacher" });
      dispatch(getAllUsersStart());
      const users = await UserService.getAllUsers();
      dispatch(getAllUsersSuccess(users));
      setIsModalOpen(false);
      toast.success("Ustoz qo'shildi");
    } catch (error) {
      toast.warn(error.response.data.message);
    }
  };

  return (
    <div className="teacher-box">
      <Button onClick={() => setIsModalOpen(true)}>+ Ustoz qo'shish</Button>
      <Modal
        title="Ustoz ma'lumotlari"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={false}
      >
        <Form
          onFinish={handleAddTeacher}
          form={form}
          labelAlign="left"
          labelCol={{
            span: 4,
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
      </Modal>
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
