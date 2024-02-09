import React, { useEffect, useState } from "react";
import { Button, Divider, Form, InputNumber, Skeleton, Table, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
} from "../../redux/userSlice";
import { UserService } from "../../services/UserService";
import { useParams } from "react-router-dom";

const HistoryBox = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const [history, setHistory] = useState(null);
  const [watchingUser, setWatchingUser] = useState(null);
  const { id } = useParams();
  const [editingHisId, setEditingHisId] = useState(false);

  const getOneUser = async () => {
    let tempData;
    if (currentUser.role !== "student") {
      dispatch(changeUserStart());
      try {
        const data = await UserService.getOneUser(id);
        setWatchingUser(data);
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

  const handleAddPractice = (his) => {
    setEditingHisId(his.id);
    form.setFieldsValue({
      practice: his.practice || 0
    })
  }

  const handleSavePractice = async ({ practice }) => {
    if (!practice) return message.warning("Iltimos bahoni kiriting!");
    practice = Number(practice);
    dispatch(changeUserStart())
    try {
      let newHistroyList = history.map(his => {
        if (his.id === editingHisId) return { ...his, practice }
        else return his;
      });
      let updatedUser = { ...watchingUser, history: newHistroyList };
      delete updatedUser.email;

      setHistory(newHistroyList.map((his, index) => ({ ...his, key: index + 1 })));
      setWatchingUser({ ...watchingUser, history: newHistroyList });
      setEditingHisId(null);
      await UserService.updateUser(watchingUser._id, updatedUser);
      dispatch(changeUserSuccess())
    } catch (error) {
      console.log(error);
      dispatch(changeUserFailure());
    }
  }

  const columns = [
    { key: "key", title: "#", dataIndex: "key", width: 50, fixed: "left" },
    {
      key: "exam",
      title: "Imtihon nomi",
      dataIndex: "title",
    },
    { key: "quizCount", title: "Savollar soni", dataIndex: "countQuiz" },
    { key: "date", title: "Sana", dataIndex: "examMoment" },
    { key: "result", title: "Yechildi", dataIndex: "correctCount" },
    {
      key: "percent",
      title: "Test(%)",
      render: (his) => {
        return `${Math.round((his.correctCount / his.countQuiz) * 100)}%`;
      },
    },
    {
      key: "practice",
      width: "180px",
      title: "Amaliyot(%)",
      render: (his) => {
        if (his.type === "exam") {
          if (currentUser.role !== "student") return <div>
            {editingHisId === his.id ?
              <Form form={form} className="d-flex align-items-center gap-2" onFinish={handleSavePractice}>
                <Form.Item className="mb-0" name="practice">
                  <InputNumber min="0" max="100" style={{ width: "80px" }} />
                </Form.Item>
                <Button htmlType="submit">save</Button>
              </Form>
              : <Button onClick={() => handleAddPractice(his)}>{his.practice || 0}%</Button>}
          </div>
          else return <p>{his.practice || 0}%</p>
        }
        else return <p>mavjud emas!</p>
      }
    },
    {
      key: "result",
      title: "Umumiy(%)",
      render: (his) => {
        let result = (his.correctCount / his.countQuiz) * 100;
        if (his.type === "exam") {
          if (his.practice) result = (result + his.practice) / 2;
          else result = result / 2;
        }
        return <p>{Math.round(result)}%</p>
      }
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


  return (
    <div className="history-box pt-3">
      <Divider>Imtihonlar tarixi</Divider>
      {history ? (
        history.length > 0 ? (
          <div>
            <Table
              bordered
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
