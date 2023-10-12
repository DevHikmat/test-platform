import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Table,
  Popconfirm,
  Switch,
  Modal,
  Form,
  Select,
  Input,
  Image,
  Avatar,
  Divider,
  message,
  Skeleton,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { UserService } from "../../services/UserService";
import {
  changeUserFailure,
  changeUserStart,
  changeUserSuccess,
  getAllUsersSuccess,
} from "../../redux/userSlice";
import "./StudentBox.scss";

const StudentBox = () => {
  const { users, groups } = useSelector((state) => state);

  const [dataSource, setDataSource] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempId, setTempId] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const avatar_rf = useRef();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAllUsers = async () => {
    dispatch(changeUserStart());
    try {
      let data = await UserService.getAllUsers();
      data = data
        .filter((user) => user.role === "student")
        .map((user, index) => ({ ...user, key: index + 1 }));
      setDataSource(data);
      setStudents(data);
      dispatch(getAllUsersSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserSuccess());
    }
  };

  const handleFillModal = (id) => {
    showModal();
    setTempId(id);
    const user = dataSource.find((item) => item._id === id);
    const group = groups.groups?.find((group) => group._id === user.group);
    form.setFieldsValue({
      firstname: user.firstname,
      lastname: user.lastname,
      group: group?._id,
    });
  };

  const saveModalInfo = async (values) => {
    let formData = new FormData();
    for (let item in values) {
      if (values[item]) {
        formData.append(`${item}`, values[item]);
      }
    }
    if (avatar_rf.current.files[0])
      formData.append("profilePicture", avatar_rf.current.files[0]);
    dispatch(changeUserStart());
    try {
      await UserService.updateUser(tempId, formData);
      dispatch(changeUserSuccess());
      message.success("Student ma'lumoti yangilandi.");
      closeModal();
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const handleDeleteUser = async (id) => {
    dispatch(changeUserStart());
    try {
      const data = await UserService.deleteUser(id);
      dispatch(changeUserSuccess());
      message.success(data);
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const toggleExamChange = async (id, accessExam) => {
    dispatch(changeUserStart());
    try {
      await UserService.updateUser(id, {
        accessExam: !accessExam,
      });
      dispatch(changeUserSuccess());
    } catch (error) {
      message.error(error.response.data.message);
      dispatch(changeUserFailure());
    }
  };

  const handlePaginated = (page) => {
    navigate(`page=${page}`);
  };

  useEffect(() => {
    handleAllUsers();
  }, [users.isChange]);

  const searchByName = (value) => {
    setStudents(
      dataSource.filter((user) =>
        user.firstname.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const searchBySurname = (value) => {
    setStudents(
      dataSource.filter((user) =>
        user.lastname.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const groupFiller = (user) => {
    const group = groups.groups?.find((item) => item._id === user.group);
    if (group) return group.name;
    else return "Noaniq";
  };

  const columns = [
    { key: "1", title: "#", dataIndex: "key", width: 50, fixed: "left" },
    {
      key: "2",
      title: "Rasmi",
      width: 80,
      render: (user) => {
        if (user.profilePicture)
          return (
            <Image
              preview={{ mask: <EyeOutlined /> }}
              width="32px"
              height="32px"
              style={{ borderRadius: "5px" }}
              src={user.profilePicture.url}
            />
          );
        else return <Avatar shape="square" icon={<UserOutlined />} />;
      },
    },
    { key: "3", title: "Ism", dataIndex: "firstname" },
    { key: "4", title: "Familya", dataIndex: "lastname" },
    {
      key: "5",
      title: "Guruhi",
      render: (user) => {
        return groupFiller(user);
      },
    },
    {
      key: "6",
      title: "Ruxsat",
      render: (user) => {
        return (
          <Switch
            checkedChildren="Ha"
            unCheckedChildren="Yo'q"
            defaultChecked={user.accessExam}
            onChange={() => toggleExamChange(user._id, user.accessExam)}
          />
        );
      },
    },
    {
      key: "7",
      title: "Actions",
      width: 120,
      fixed: "right",
      render: (user) => {
        return (
          <div className="d-flex">
            <Link to={`view/${user._id}`}>
              <Button type="primary" icon={<EyeOutlined />}></Button>
            </Link>
            <Button
              className="mx-2"
              onClick={() => handleFillModal(user._id)}
              icon={<EditOutlined />}
            ></Button>
            <Popconfirm
              okText="Ha"
              cancelText="Yo'q"
              title="Rostdan bu o'quvchini o'chirmoqchimisiz?"
              okType="danger"
              onConfirm={() => handleDeleteUser(user._id)}
            >
              <Button danger icon={<DeleteOutlined />}></Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <div className="student-box">
      <Divider orientation="left">Qidirish</Divider>
      <div className="row row-cols-md-4 row-cols-lg-4 mb-5">
        <div className="col">
          <Input
            placeholder="Ism bo'yicha"
            onChange={(e) => searchByName(e.target.value)}
          />
        </div>
        <div className="col">
          <Input
            placeholder="Familya bo'yicha"
            onChange={(e) => searchBySurname(e.target.value)}
          />
        </div>
      </div>

      {users.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          columns={columns}
          dataSource={students}
          size="small"
          scroll={{ x: 1000 }}
          pagination={{
            onChange: handlePaginated,
          }}
        />
      )}
      <Modal
        width={350}
        footer={false}
        title="O'quvchi ma'lumotlari"
        open={isModalOpen}
        onCancel={closeModal}
      >
        <Form
          form={form}
          encType="multipart/form-data"
          labelCol={{ span: 5 }}
          layout="vertical"
          onFinish={saveModalInfo}
        >
          <Form.Item
            className="mb-2"
            label="Ism"
            name="firstname"
            rules={[
              {
                required: true,
                message: "Ismni kiriting",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="mb-2"
            label="Familya"
            name="lastname"
            rules={[
              {
                required: true,
                message: "Familyani kiriting",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="mb-2"
            label="Guruh"
            name="group"
            rules={[
              {
                required: true,
                message: "Guruhni kiriting",
              },
            ]}
          >
            <Select>
              {groups.groups?.map((group, index) => {
                return (
                  <Select.Option value={group._id} key={index}>
                    {group.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item className="mb-2" label="Parol" name="password">
            <Input placeholder="Yangi parol berish" />
          </Form.Item>
          <input
            className="form-control my-3"
            type="file"
            accept="image/*"
            ref={avatar_rf}
          />

          <Form.Item>
            <Button htmlType="submit" loading={users.isLoading} type="primary">
              O'zgarishlarni saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentBox;
