import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Skeleton,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuizFailure,
  changeQuizStart,
  changeQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";
import { Link } from "react-router-dom";

const QuizAdminBox = () => {
  const { quiz, category } = useSelector((state) => state);
  const { quizList, isLoading } = quiz;
  const [dataSource, setDataSource] = useState([]);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [tempId, setTempId] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = async (id) => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.deleteQuiz(id);
      message.success(data);
      dispatch(changeQuizSuccess());
    } catch (error) {
      message.warning(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  const openAndFillModal = (id) => {
    setTempId(id);
    const currentQuiz = dataSource.find((quiz) => quiz._id === id);
    setOpen(true);
    form.setFieldsValue({
      title: currentQuiz.title,
      countQuiz: currentQuiz.countQuiz,
      quizTime: currentQuiz.quizTime,
    });
  };

  const saveUpdates = async (quiz) => {
    dispatch(changeQuizStart());
    try {
      const data = await QuizService.updateQuiz(tempId, quiz);
      message.success(data.message);
      dispatch(changeQuizSuccess());
      setOpen(false);
    } catch (error) {
      message.warning(error.response.data.message);
      dispatch(changeQuizFailure());
    }
  };

  const columns = [
    { key: "1", title: "T/R", dataIndex: "key" },
    { key: "1", title: "Imtihon nomi", dataIndex: "title" },
    { key: "1", title: "Kategoriyasi", dataIndex: "catName" },
    { key: "1", title: "Savollar soni", dataIndex: "countQuiz" },
    { key: "1", title: "Berilgan vaqt", dataIndex: "quizTime" },
    {
      key: "1",
      title: "Funksiyalar",
      render: (quiz) => {
        return (
          <div className="d-flex gap-2">
            <Link to={`${quiz._id}`}>
              <Button icon={<EyeOutlined />} />
            </Link>
            <Button
              onClick={() => openAndFillModal(quiz._id)}
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="Imtihon o'chirilsinmi?"
              okText="ha"
              cancelText="yo'q"
              okType="danger"
              onConfirm={() => handleDelete(quiz._id)}
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    setDataSource(
      quizList?.map((item, index) => {
        let currentCat = category.category?.find(
          (cat) => cat._id === item.categoryId
        );
        return { ...item, key: index + 1, catName: currentCat?.name };
      })
    );
  }, [quizList, category]);
  return (
    <div>
      {quizList ? (
        quizList.length > 0 ? (
          <Table columns={columns} dataSource={dataSource} />
        ) : (
          "Imtihonlar mavjud emas"
        )
      ) : (
        <Skeleton active />
      )}
      <Modal
        title="Imtihonni o'zgartirish"
        footer={false}
        open={open}
        onCancel={() => setOpen(false)}
      >
        <Form
          labelCol={{ span: 6 }}
          labelAlign="left"
          form={form}
          onFinish={saveUpdates}
        >
          <Form.Item
            name="title"
            label="Nomi"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input placeholder="Imtihon nomini kiriting" />
          </Form.Item>
          <Form.Item
            name="countQuiz"
            label="Savollar soni"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input placeholder="Savollar sonini kiriting" />
          </Form.Item>
          <Form.Item
            name="quizTime"
            label="Vaqti"
            rules={[{ required: true, message: "maydonni to'ldiring" }]}
          >
            <Input placeholder="Berilgan vaqtni kiriting" />
          </Form.Item>
          <Button loading={isLoading} htmlType="submit">
            Saqlash
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default QuizAdminBox;
