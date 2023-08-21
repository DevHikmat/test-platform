import React from "react";
import { useSelector } from "react-redux";
import { Divider, Row } from "antd";
import QuizAdminItem from "./QuizAdminItem";
import QuizStudentItem from "./QuizStudentItem";
import QuizTeacherItem from "./QuizTeacherItem";
import "./Quiz.scss";

const QuizBox = () => {
  const { quizList } = useSelector((state) => state.quiz);
  const { currentUser } = useSelector((state) => state.auth);

  const quizItemHandler = (item, index) => {
    const { role } = currentUser;
    if (role === "student") {
      return <QuizStudentItem key={index} quiz={item} />;
    } else if (role === "teacher") {
      return <QuizTeacherItem key={index} quiz={item} />;
    } else {
      return <QuizAdminItem key={index} quiz={item} />;
    }
  };

  return (
    <div className="quiz-box" style={{ cursor: "pointer" }}>
      <div className="container">
        <Divider orientation="left">Imtihonlar bo'limi</Divider>
        <Row gutter={24}>
          {currentUser &&
            quizList?.map((item, index) => {
              return quizItemHandler(item, index);
            })}
        </Row>
      </div>
    </div>
  );
};

export default QuizBox;
