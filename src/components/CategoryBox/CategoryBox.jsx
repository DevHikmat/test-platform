import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Row } from "antd";
import { MinusOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import CategoryItem from "./CategoryItem";
import "./Category.scss";
import {
  createCategoryStart,
  createCategorySuccess,
} from "../../redux/categorySlice";
import { CategoryService } from "../../services/CategoryService";

const CategoryBox = () => {
  const catImage = useRef();
  const catName = useRef();
  const dispatch = useDispatch();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { category, isLoading } = useSelector((state) => state.category);

  const handleCreateCategory = async () => {
    if (!catName.current.value || !catImage.current.files[0])
      return toast.warn("Barcha maydonni to'ldiring!");
    dispatch(createCategoryStart());
    try {
      let formData = new FormData();
      formData.append("name", catName.current.value);
      formData.append("image", catImage.current.files[0]);
      const data = await CategoryService.createCategory(formData);
      dispatch(createCategorySuccess());
      toast.success(data.message);
      catName.current.value = "";
      catImage.current.value = "";
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="category-box">
      <div className="category-box-actions d-flex flex-wrap mb-3">
        <Button
          style={{ width: "100px", height: "30px", marginBottom: "20px" }}
          className="d-flex align-items-center justify-content-center"
          icon={isCreateOpen ? <MinusOutlined /> : <PlusOutlined />}
          onClick={() => setIsCreateOpen(!isCreateOpen)}
        />
        {isCreateOpen && (
          <>
            <div className="hide-menu ms-5 d-flex flex-wrap gap-3">
              <input
                className="form-control"
                style={{ width: "250px", height: "35px" }}
                ref={catName}
                placeholder="Kategoriya nomini kiriting"
              />
              <input
                style={{ width: "250px", height: "35px" }}
                className="form-control"
                ref={catImage}
                type="file"
                placeholder="Kategoriya nomini kiriting"
              />
              <Button
                loading={isLoading}
                style={{ height: "35px" }}
                className="ms-5 d-flex align-items-center"
                icon={<SendOutlined />}
                onClick={handleCreateCategory}
              >
                saqlash
              </Button>
            </div>
          </>
        )}
      </div>
      <hr />
      <Row gutter={24}>
        {category?.map((cat, index) => {
          return <CategoryItem key={index} cat={cat} />;
        })}
      </Row>
    </div>
  );
};

export default CategoryBox;
