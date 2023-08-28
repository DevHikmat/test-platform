import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import QuizStudentItem from "./QuizStudentItem";
import QuizTeacherItem from "./QuizTeacherItem";
import "./Quiz.scss";
import { PlusOutlined } from "@ant-design/icons";
import { QuizService } from "../../services/QuizService";
import {
  changeQuizStart,
  changeQuizSuccess,
  changeQuizFailure,
} from "../../redux/quizSlice";
import QuizAdminBox from "./QuizAdminBox";

const { Option } = Select;

const QuizBox = () => {
  const [form] = Form.useForm();
  const { category, quiz, auth } = useSelector((state) => state);
  const { quizList, isLoading } = quiz;
  const { currentUser } = auth;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const quizItemHandler = (item, index) => {
    const { role } = currentUser;
    if (role === "student") {
      return <QuizStudentItem key={index} quiz={item} />;
    } else if (role === "teacher") {
      return <QuizTeacherItem key={index} quiz={item} />;
    }
  };

  const handleExamAdd = async (values) => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.addQuiz(values);
      message.success(data.message);
      dispatch(changeQuizSuccess());
      setOpen(false);
      form.setFieldsValue({
        title: "",
        categoryId: "",
        countQuiz: "",
        quizTime: "",
      });
    } catch (error) {
      message.warning(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  return (
    <div className="quiz-box" style={{ cursor: "pointer" }}>
      <div className="d-flex justify-content-end">
        {currentUser?.role === "admin" && (
          <>
            <Button
              icon={<PlusOutlined />}
              className="quiz-add-btn"
              onClick={showDrawer}
            />
          </>
        )}
      </div>
      <Drawer
        width={400}
        title="Imtihon qo'shish"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          labelAlign="left"
          onFinish={handleExamAdd}
        >
          <Form.Item
            label="Nomi"
            name="title"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input placeholder="Imtihon nomi" />
          </Form.Item>
          <Form.Item
            label="Kategoriya"
            name="categoryId"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Select placeholder="Tanlash">
              {category?.category?.map((cat, index) => {
                return (
                  <Option key={index} value={cat._id}>
                    {cat.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Savol soni"
            name="countQuiz"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input type="number" placeholder="Imtihonda nechta savol bo'lsin" />
          </Form.Item>
          <Form.Item
            label="Vaqti(min)"
            name="quizTime"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input type="number" placeholder="Imtihonga beriladigan vaqt" />
          </Form.Item>
          <Button loading={isLoading} htmlType="submit">
            Yaratish
          </Button>
        </Form>
      </Drawer>

      <Divider orientation="center">Imtihonlar bo'limi</Divider>
      {currentUser?.role === "admin" && <QuizAdminBox />}
      <Row gutter={24}>
        {currentUser &&
          quizList?.map((item, index) => {
            return quizItemHandler(item, index);
          })}
      </Row>
    </div>
  );
};

export default QuizBox;
