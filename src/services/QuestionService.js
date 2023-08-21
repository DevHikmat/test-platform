import { axiosInstance } from "./axiosInstance";

export const QuestionService = {
  async getAllQuestions() {
    const res = await axiosInstance.get("/question");
    return res.data;
  },
  async addQuestion(formData) {
    const res = await axiosInstance.post("/question", formData);
    console.log(res);
    return res.data;
  },
  async deleteQuestion(id) {
    const res = await axiosInstance.delete(`/question/${id}`);
    return res.data;
  },
};
