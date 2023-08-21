import React, { useEffect, useState } from "react";
import { Divider, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getOneUserFailure, getOneUserStart } from "../../redux/userSlice";
import { UserService } from "../../services/UserService";
import { useParams } from "react-router-dom";
const columns = [
  { key: "key", title: "#", dataIndex: "key", width: 50, fixed: "left" },
  {
    key: "exam",
    title: "Imtihon nomi",
    dataIndex: "title",
  },
  { key: "quizCount", title: "Savollar soni", dataIndex: "countQuiz" },
  { key: "date", title: "Topshirgan sana", dataIndex: "examMoment" },
  { key: "result", title: "Yechildi", dataIndex: "correctCount" },
  {
    key: "percent",
    title: "Natija(%)",
    render: (his) => {
      return `${Math.round((his.correctCount / his.countQuiz) * 100)}%`;
    },
  },
  {
    key: "result",
    title: "Status",
    render: (his) => {
      return Math.round((his.correctCount / his.countQuiz) * 100) >= 60 ? (
        <span className="text-success">passed</span>
      ) : (
        <span className="text-danger">failed</span>
      );
    },
    width: 100,
    fixed: "right",
  },
];

const HistoryBox = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [history, setHistory] = useState(null);
  const { id } = useParams();

  const getOneUser = async () => {
    let tempData;
    if (currentUser.role !== "student") {
      dispatch(getOneUserStart());
      try {
        const data = await UserService.getOneUser(id);
        tempData = data.history;
      } catch (error) {
        console.log(error);
        dispatch(getOneUserFailure());
      }
    } else {
      tempData = currentUser.history;
    }
    setHistory(tempData?.map((item, index) => ({ ...item, key: index + 1 })));
  };

  useEffect(() => {
    getOneUser();
  }, []);

  return (
    <div className="history-box pt-3">
      {history && history.length > 0 ? (
        <div>
          <Divider>Imtihonlar tarixi</Divider>
          <Table
            scroll={{ x: 900 }}
            columns={columns}
            dataSource={history}
            pagination={false}
          />
        </div>
      ) : (
        <h5>Tarix mavjud emas!</h5>
      )}
    </div>
  );
};

export default HistoryBox;
