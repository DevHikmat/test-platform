import React, { useEffect, useState } from "react";
import { Divider, Skeleton, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
} from "../../redux/userSlice";
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
      dispatch(changeUserStart());
      try {
        const data = await UserService.getOneUser(id);
        tempData = data.history;
        dispatch(changeUserSuccess());
      } catch (error) {
        message.error(error.response.data.message);
        dispatch(changeUserFailure());
      }
    } else {
      tempData = currentUser.history;
    }
    setHistory(tempData?.map((item, index) => ({ ...item, key: index + 1 })));
  };

  useEffect(() => {
    getOneUser();
  }, [id]);

  return (
    <div className="history-box pt-3">
      <Divider>Imtihonlar tarixi</Divider>
      {history ? (
        history.length > 0 ? (
          <div>
            <Table
              scroll={{ x: 900 }}
              columns={columns}
              dataSource={history}
              pagination={false}
            />
          </div>
        ) : (
          <div>
            <h6 className="mt-3">Tarix mavjud emas!</h6>
          </div>
        )
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default HistoryBox;
