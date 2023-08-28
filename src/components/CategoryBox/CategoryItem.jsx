import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Popconfirm, message } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  changeCategoryFailure,
  changeCategoryStart,
  changeCategorySuccess,
} from "../../redux/categorySlice";
import { CategoryService } from "../../services/CategoryService";
const CategoryItem = ({ cat, handleEditCategory }) => {
  const dispatch = useDispatch();

  const handleDeleteCategory = async (id) => {
    dispatch(changeCategoryStart());
    try {
      const data = await CategoryService.deleteCategory(id);
      message.success(data);
      dispatch(changeCategorySuccess());
    } catch (error) {
      dispatch(changeCategoryFailure());
      message.error(error.response.data.message);
    }
  };
  return (
    <Col xs={24} sm={24} md={8} lg={8} xl={6}>
      <div className="category-box-item">
        <Card
          hoverable
          style={{
            width: "100%",
            marginBottom: "30px",
          }}
          cover={
            <img
              alt="category img"
              style={{ height: "220px", objectFit: "cover" }}
              src={cat.image?.url}
            ></img>
          }
        >
          <div className="content">
            <h6>{cat.name}</h6>
            <div className="d-flex gap-3">
              <Link to={`category/${cat._id}`}>
                <Button icon={<EyeOutlined />}></Button>
              </Link>
              <Button
                onClick={() => handleEditCategory(cat._id)}
                icon={<EditOutlined />}
              ></Button>
              <Popconfirm
                okText="o'chirish"
                cancelText="bekor qilish"
                title="Diqqat! Shu kategoriyaga doir barcha savollar o'chib ketadi."
                okType="danger"
                onConfirm={() => handleDeleteCategory(cat._id)}
              >
                <Button icon={<DeleteOutlined />}></Button>
              </Popconfirm>
            </div>
          </div>
        </Card>
      </div>
    </Col>
  );
};

export default CategoryItem;
