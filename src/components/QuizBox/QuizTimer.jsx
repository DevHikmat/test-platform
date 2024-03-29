import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { quizFinishSuccess } from "../../redux/quizSlice";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import {
  authChangeStart,
  authChangeSuccess,
  authChangeFailure,
} from "../../redux/authSlice";
import { UserService } from "../../services/UserService";

const QuizTimer = ({ studentAnswers }) => {
  const dispatch = useDispatch();
  const { quiz, auth, category } = useSelector((state) => state);
  const { isFinished, currentQuiz } = quiz;
  let { currentUser } = auth;
  let timer;

  const { quizTime, questions } = currentQuiz;
  const targetTime = {
    minutes: quizTime,
    seconds: 0,
  };
  const [remainingTime, setRemainingTime] = useState(targetTime);

  const countDown = (interval) => {
    if (
      (remainingTime.minutes === 0 && remainingTime.seconds === 0) ||
      isFinished
    ) {
      handleScore();
      clearTimeout(timer);
      clearInterval(interval);
    } else {
      setRemainingTime((prevTime) => {
        let minutes =
          prevTime.seconds === 0 ? prevTime.minutes - 1 : prevTime.minutes;
        let seconds = prevTime.seconds === 0 ? 59 : prevTime.seconds - 1;
        return { minutes, seconds };
      });
    }
  };

  const handleScore = async () => {
    let correctCount = 0;
    let wrongAttemps = [];
    for (let i = 0; i < questions.length; i++) {
      let currentQueId = questions[i]._id;
      let currentAnSt = studentAnswers.find(
        (ans) => ans.queId === currentQueId
      );
      if (
        currentAnSt &&
        currentAnSt.answer &&
        currentAnSt.answer === questions[i].correctAnswer
      ) {
        correctCount++;
      } else {
        wrongAttemps.push({
          ...questions[i],
          queNum: i,
          theAns: currentAnSt?.answer ? currentAnSt.answer : "",
        });
      }
    }
    dispatch(quizFinishSuccess({ correctCount, wrongAttemps }));
    const getCurrentTime = async () => {
      let data;
      try {
        const response = await fetch("http://worldtimeapi.org/api/ip");
        data = await response.json();
        return data;
      } catch (error) {
        data = new Date();
        return { datetime: data };
      }
    };
    const handleAddHistory = async () => {
      const data = await getCurrentTime();
      dispatch(authChangeStart());
      try {
        let currentCategory = category.category?.find(cat => cat._id === currentQuiz.categoryId);
        let examResult = {
          id: uuidv4(),
          type: currentCategory.type,
          title: currentQuiz.title,
          countQuiz: currentQuiz.countQuiz,
          examMoment: moment(data.datetime).format("MMMM Do YYYY, h:mm"),
          correctCount,
        };
        currentUser = {
          accessExam: currentCategory.type === "exam" ? false : true,
          history: [...currentUser.history, examResult],
        };
        const id = localStorage.getItem("id");
        const updatedUser = await UserService.updateUser(id, currentUser);
        dispatch(authChangeSuccess(updatedUser));
      } catch (error) {
        dispatch(authChangeFailure());
      }
    };
    handleAddHistory();
  };

  useEffect(() => {
    timer = setTimeout(() => {
      handleScore(timer);
    }, (targetTime.minutes * 60000));
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => countDown(interval), 1000);
    return () => {
      clearInterval(interval);
    };
  }, [remainingTime]);


  return (
    <div
      className={
        remainingTime.minutes >= 5
          ? "quiz-user-view-timer shadow text-success"
          : "quiz-user-view-timer shadow text-warning"
      }
    >
      <i className="fa-regular fa-clock"></i>
      <div className="d-flex">
        <div className="quiz-user-view-timer-minute">
          {remainingTime.minutes < 10
            ? `0${remainingTime.minutes}`
            : remainingTime.minutes}
        </div>
        :
        <div className="quiz-user-view-timer-secound">
          {remainingTime.seconds < 10
            ? `0${remainingTime.seconds}`
            : remainingTime.seconds}
        </div>
      </div>
    </div>
  );
};

export default QuizTimer;
