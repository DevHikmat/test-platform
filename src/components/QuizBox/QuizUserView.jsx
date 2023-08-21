import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { QuizService } from "../../services/QuizService";
import {
  getOneQuizStart,
  getOneQuizSuccess,
  quizFinishSuccess,
} from "../../redux/quizSlice";
import "./Quiz.scss";
import QuizTimer from "./QuizTimer";
import QuizQuestion from "./QuizQuestion";

const QuizUserView = () => {
  const { isFinished } = useSelector((state) => state.quiz);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const dispatch = useDispatch();
  const { id } = useParams();

  const handleNextQuestion = () => {
    setCurrentQuestion(currentQuiz.questions[currentIndex + 1]);
    setCurrentIndex((pre) => pre + 1);
  };
  const handlePrevQuestion = () => {
    setCurrentQuestion(currentQuiz.questions[currentIndex - 1]);
    setCurrentIndex((pre) => pre - 1);
  };

  const handleGetOneQuiz = async () => {
    dispatch(getOneQuizStart());
    try {
      const data = await QuizService.getOneQuiz(id);
      const quizList = data.quizzes[0];
      dispatch(getOneQuizSuccess(quizList));
      setCurrentQuiz(quizList);
      setCurrentQuestion(quizList.questions[0]);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleFinishExam = () => {
    dispatch(quizFinishSuccess());
  };

  useEffect(() => {
    handleGetOneQuiz();
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [id]);

  useEffect(() => {
    function blockReload(event) {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave? Yangilanish";
    }
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopstate);
    window.addEventListener("beforeunload", blockReload);
    return () => {
      window.removeEventListener("beforeunload", blockReload);
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handlePopstate = () => {
    window.history.pushState(null, document.title, window.location.href);
  };

  return (
    currentQuiz && (
      <div className="quiz-user-view">
        <ul className="quiz-user-view-info d-flex gap-5 align-items-center">
          <QuizTimer studentAnswers={studentAnswers} quizTime={1} />
          <div className="quiz-user-view-info-count border-end pe-5">
            <span>Jami savollar soni: </span>
            {currentQuiz.countQuiz} ta
          </div>
        </ul>
        <Divider></Divider>

        <div className="quiz-user-view-question">
          <QuizQuestion
            question={currentQuestion}
            index={currentIndex + 1}
            studentAnswers={studentAnswers}
            setStudentAnswers={setStudentAnswers}
          />
        </div>

        {!isFinished && (
          <div className="quiz-user-view-controls mt-5 d-flex gap-5">
            <Button
              onClick={handlePrevQuestion}
              disabled={currentIndex <= 0}
              icon={<LeftOutlined />}
            >
              Ortga
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentIndex >= currentQuiz.questions.length - 1}
              icon={<RightOutlined />}
            >
              Oldinga
            </Button>

            {currentIndex + 1 === currentQuiz.questions.length && (
              <Button
                className="bg-success text-white"
                onClick={handleFinishExam}
              >
                Yakunlash
              </Button>
            )}
          </div>
        )}
      </div>
    )
  );
};

export default QuizUserView;
