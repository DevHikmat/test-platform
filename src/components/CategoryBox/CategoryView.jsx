import { PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Table, Button, Divider, Form, Input, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import {
  addQuizFailure,
  addQuizStart,
  addQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";
import { QuestionService } from "../../services/QuestionService";
import {
  addQuestionStart,
  addQuestionSuccess,
  deleteQuestionStart,
  deleteQuestionSuccess,
  getAllQuestionStart,
  getAllQuestionSuccess,
} from "../../redux/questionSlice";
const { TextArea } = Input;

const CategoryView = () => {
  const [questionList, setQuestionList] = useState([]);
  const { id } = useParams();
  const { isChange, isLoading } = useSelector((state) => state.question);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleAllQuestion = async () => {
    dispatch(getAllQuestionStart());
    try {
      const data = await QuestionService.getAllQuestions();
      setQuestionList(
        data.question
          .filter((que) => que.category === id)
          .map((item, index) => ({ ...item, key: index + 1 }))
      );
      dispatch(getAllQuestionSuccess());
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddQuestion = async (values) => {
    const { quizQuestion, correctAnswer, choice1, choice2, choice3 } = values;
    if (!quizQuestion || !correctAnswer || !choice1 || !choice2 || !choice3)
      return toast.warn("Iltimos barcha maydonlarni to'ldiring!");
    if (quizQuestion.length < 5)
      return toast.warn("Savol uzunligi 5 dan kam bo'lmasligi kerak!");
    if (correctAnswer.length < 3)
      return toast.warn("To'g'ri javob uzunligi 3 dan kam bo'lmasligi kerak!");
    dispatch(addQuestionStart());
    try {
      let formData = new FormData();
      formData.append("quizQuestion", quizQuestion);
      formData.append("correctAnswer", correctAnswer);
      formData.append("choice1", choice1);
      formData.append("choice2", choice2);
      formData.append("choice3", choice3);
      formData.append("category", id);
      const data = await QuestionService.addQuestion(formData);
      dispatch(addQuestionSuccess());
      toast.success(data.message);
      form.setFieldsValue({
        quizQuestion: "",
        correctAnswer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteQuestion = async (id) => {
    dispatch(deleteQuestionStart());
    try {
      const data = await QuestionService.deleteQuestion(id);
      console.log(data);
      dispatch(deleteQuestionSuccess());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleFinish = async (quiz) => {
    dispatch(addQuizStart());
    try {
      let addingQuiz = { ...quiz, categoryId: id };
      const data = await QuizService.addQuiz(addingQuiz);
      dispatch(addQuizSuccess());
      toast.success("Imtihon qo'shildi");
      form.setFieldsValue({
        title: "",
        quizCount: "",
        quizTime: "",
      });
    } catch (error) {
      dispatch(addQuizFailure());
      toast.warn("Imtihon qo'shish uchun savollar yetarli emas!");
    }
  };

  useEffect(() => {
    handleAllQuestion();
  }, [isChange]);

  const columns = [
    { key: "id", width: "50px", title: "#", dataIndex: "key" },
    {
      key: "question",
      title: "Savollar",
      render: (que) => {
        return (
          <p style={{ whiteSpace: "pre-wrap", maxWidth: "400px" }}>
            {que.quizQuestion}
          </p>
        );
      },
    },
    {
      key: "answer",
      title: "Javob",
      render: (que) => {
        return <p>{que.correctAnswer}</p>;
      },
    },
    {
      key: "action",
      title: "O'chirish",
      width: "100px",
      render: (que) => {
        return (
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            disabled={isLoading}
            danger
            onClick={() => handleDeleteQuestion(que._id)}
          ></Button>
        );
      },
    },
  ];
  return (
    <div className="category-view">
      <div className="row row-cols-sm-1 row-cols-md-2 row-cols-lg-2">
        <div className="col">
          <Divider>Savol qo'shish</Divider>
          <Form
            form={form}
            labelCol={{ span: 6 }}
            labelAlign="left"
            onFinish={handleAddQuestion}
          >
            <Form.Item label="Savolni kiriting" name="quizQuestion">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item
              label="To'g'ri javob"
              name="correctAnswer"
              className="mb-3 text-primary"
            >
              <Input />
            </Form.Item>
            <Form.Item label="Variant 1" name="choice1" className="mb-1">
              <Input />
            </Form.Item>
            <Form.Item label="Variant 2" name="choice2" className="mb-1">
              <Input />
            </Form.Item>
            <Form.Item label="Variant 3" name="choice3" className="mb-1">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                className="my-3 d-flex align-items-center"
                htmlType="submit"
                icon={<PlusOutlined />}
              >
                Savolni saqlash
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="col">
          <Divider>Imtihon qo'shish</Divider>
          <Form
            labelCol={{ span: 6 }}
            labelAlign="left"
            onFinish={handleFinish}
          >
            <Form.Item
              name="title"
              label="Imtihon nomi"
              rules={[
                {
                  required: true,
                  message: "Iltimos maydonni to'ldiring",
                },
              ]}
            >
              <Input style={{ width: "300px" }} />
            </Form.Item>
            <Form.Item
              name="countQuiz"
              label="Savollar soni"
              rules={[
                {
                  required: true,
                  message: "Iltimos maydonni to'ldiring",
                },
              ]}
            >
              <Input style={{ width: "300px" }} type="number" />
            </Form.Item>
            <Form.Item
              name="quizTime"
              label="Berilgan vaqt"
              rules={[
                {
                  required: true,
                  message: "Iltimos maydonni to'ldiring",
                },
              ]}
            >
              <Input style={{ width: "300px" }} type="number" />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                className="d-flex align-items-center"
                icon={<PlusCircleFilled />}
              >
                Imtihonni qo'shish
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Divider orientation="center">Shu kategoriyaga Doir Savollar</Divider>
      {questionList.length > 0 ? (
        <Table
          ellipsize={true}
          style={{ width: "100%" }}
          size="small"
          columns={columns}
          dataSource={questionList}
        />
      ) : (
        <h6 className="text-left">Savollar yo'q</h6>
      )}
    </div>
  );
};

export default CategoryView;
