import { PlusOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Divider,
  Form,
  Input,
  Skeleton,
  Drawer,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { QuestionService } from "../../services/QuestionService";
import {
  changeQueFailure,
  changeQueStart,
  changeQueSuccess,
} from "../../redux/questionSlice";
const { TextArea } = Input;

const CategoryView = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questionList, setQuestionList] = useState(null);
  const { id } = useParams();
  const { isChange, isLoading } = useSelector((state) => state.question);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [queUrl, setQueUrl] = useState(null);
  const [activePageNumber, setActivePageNumber] = useState(
    +searchParams.get("page") || 1
  );
  const [totalPage, setTotalPage] = useState(1);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleAllQuestion = async (page = 1) => {
    try {
      const data = await QuestionService.getAllQuestions(id, page);
      setTotalPage(data.totalPage);
      setQuestionList(
        data?.question.map((item, index) => ({
          ...item,
          key: (index + 1) + (page - 1) * 20,
        }))
      );
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleAddQuestion = async (values) => {
    const { quizQuestion, correctAnswer, choice1, choice2, choice3 } = values;
    if (!quizQuestion || !correctAnswer || !choice1 || !choice2 || !choice3)
      return message.warning("Iltimos barcha maydonlarni to'ldiring!");
    if (quizQuestion.length < 5)
      return message.warning("Savol uzunligi 5 dan kam bo'lmasligi kerak!");
    if (correctAnswer.length < 3)
      return message.warning(
        "To'g'ri javob uzunligi 3 dan kam bo'lmasligi kerak!"
      );
    dispatch(changeQueStart());
    try {
      let formData = new FormData();
      queUrl && formData.append("questionImage", queUrl);
      formData.append("quizQuestion", quizQuestion);
      formData.append("correctAnswer", correctAnswer);
      formData.append("choice1", choice1);
      formData.append("choice2", choice2);
      formData.append("choice3", choice3);
      formData.append("category", id);
      const data = await QuestionService.addQuestion(formData);
      dispatch(changeQueSuccess());
      message.success(data.message);
      setQueUrl(null);
      form.setFieldsValue({
        quizQuestion: "",
        correctAnswer: "",
        choice1: "",
        choice2: "",
        choice3: "",
      });
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQueFailure());
    }
  };

  const handlePaginatedQuestion = (page) => {
    navigate(`?page=${page}`);
    setActivePageNumber(page);
    handleAllQuestion(page);
  };

  const handleDeleteQuestion = async (id) => {
    dispatch(changeQueStart());
    try {
      const data = await QuestionService.deleteQuestion(id);
      message.success(data.message);
      dispatch(changeQueSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeQueFailure());
    }
  };

  useEffect(() => {
    handleAllQuestion(activePageNumber);
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
      <div className="row row-cols-sm-1 row-cols-md-1 row-cols-lg-1">
        <div className="d-flex justify-content-end">
          <Button
            icon={<PlusOutlined />}
            type="primary"
            className="que-add-btn"
            ghost={true}
            onClick={showDrawer}
          ></Button>
        </div>
        <Drawer
          width={600}
          title="Savol qo'shish"
          placement="right"
          onClose={onClose}
          open={open}
        >
          <div className="col">
            <Form
              form={form}
              labelCol={{ span: 5 }}
              labelAlign="left"
              onFinish={handleAddQuestion}
            >
              <Form.Item>
                <div className="question-img">
                  <label htmlFor="queImg">
                    {queUrl ? (
                      <img
                        src={URL.createObjectURL(queUrl)}
                        alt="savol rasmi"
                      />
                    ) : (
                      <i className="fa-regular fa-image"></i>
                    )}
                  </label>
                  <input
                    id="queImg"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={(e) => setQueUrl(e.target.files[0])}
                  />
                </div>
              </Form.Item>
              <Form.Item label="Savol:" name="quizQuestion">
                <TextArea rows={3} />
              </Form.Item>
              <Form.Item
                label="Javob"
                name="correctAnswer"
                className="mb-3 text-primary"
              >
                <Input />
              </Form.Item>
              <Form.Item label="Xato 1" name="choice1" className="mb-1">
                <Input />
              </Form.Item>
              <Form.Item label="Xato 2" name="choice2" className="mb-1">
                <Input />
              </Form.Item>
              <Form.Item label="Xato 3" name="choice3" className="mb-1">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  className="my-3 d-flex align-items-center"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Savolni saqlash
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Drawer>
      </div>
      <Divider orientation="center">Shu kategoriyaga Doir Savollar</Divider>
      {questionList ? (
        questionList.length > 0 ? (
          <Table
            ellipsize={true}
            style={{ width: "100%" }}
            size="small"
            columns={columns}
            dataSource={questionList}
            pagination={{
              onChange: handlePaginatedQuestion,
              defaultCurrent: activePageNumber,
              pageSize: 20,
              total: 20 * totalPage,
            }}
          />
        ) : (
          <h6 className="text-left">Savol qo'shilmagan!</h6>
        )
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default CategoryView;
