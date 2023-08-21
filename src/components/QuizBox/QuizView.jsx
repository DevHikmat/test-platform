import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Divider, Table, Button, Popconfirm } from "antd";
import {
  deleteQuizStart,
  deleteQuizSuccess,
  getOneQuizStart,
  getOneQuizSuccess,
} from "../../redux/quizSlice";
import { QuizService } from "../../services/QuizService";

const QuizView = () => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();

  const handleGetOneQuiz = async () => {
    dispatch(getOneQuizStart());
    try {
      const data = await QuizService.getOneQuiz(id);
      dispatch(getOneQuizSuccess());
      setQuestionList(
        data.quizzes[0].questions.map((que, index) => ({
          ...que,
          key: index + 1,
        }))
      );
      setCurrentQuiz(data.quizzes[0]);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    dispatch(deleteQuizStart());
    try {
      const data = await QuizService.deleteQuiz(id);
      navigate("/admin/quiz");
      dispatch(deleteQuizSuccess());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    handleGetOneQuiz();
  }, [id]);

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
      title: "To'g'ri javob",
      render: (que) => {
        return <p>{que.correctAnswer}</p>;
      },
    },
  ];

  return (
    currentQuiz && (
      <div className="quiz-view">
        <div className="d-flex justify-content-between align-items-center">
          <h3>{currentQuiz.title}</h3>
          <Popconfirm
            okType="danger"
            title="O'chirilsinmi ?"
            okText="Ha"
            cancelText="Yo'q"
            onConfirm={() => handleDelete(currentQuiz._id)}
          >
            <Button danger>Imtihonni o'chirish</Button>
          </Popconfirm>
        </div>
        <ul className="list-unstyled list-group list-group-horizontal gap-5">
          <li>
            <span className="fw-bold">Savollar soni:</span>{" "}
            {currentQuiz.countQuiz}
          </li>
          <li>
            <span className="fw-bold">Berilgan vaqt:</span>{" "}
            {currentQuiz.quizTime} min
          </li>
        </ul>
        <Divider>Imtihon savollari</Divider>
        <Table columns={columns} dataSource={questionList} />
      </div>
    )
  );
};

export default QuizView;
