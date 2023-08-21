import React from "react";

const QuizChoice = ({ option, num, id, currentAnswer, setCurrentAnswer }) => {
  return (
    <div className="quiz-choice">
      <div className="mb-3 d-flex align-items-center">
        <input
          value={option}
          id={`opt${num}`}
          checked={option === currentAnswer?.answer}
          className="me-2"
          type="radio"
          name={`${id}`}
          onChange={() => setCurrentAnswer({ queId: id, answer: option })}
        />
        <label style={{ cursor: "pointer" }} htmlFor={`opt${num}`}>
          {option}
        </label>
      </div>
    </div>
  );
};

export default QuizChoice;
