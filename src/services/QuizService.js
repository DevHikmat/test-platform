import { axiosInstance } from "./axiosInstance";

export const QuizService = {
  async getAllQuiz() {
    const res = await axiosInstance.get("/quiz");
    return res.data;
  },
  async getOneQuiz(id) {
    const res = await axiosInstance.get(`/quiz/${id}`);
    return res.data;
  },
  async addQuiz(quiz) {
    const res = await axiosInstance.post("/quiz", quiz);
    return res.data;
  },
  async deleteQuiz(id) {
    const res = await axiosInstance.delete(`/quiz/${id}`);
    console.log(res);
  },
};
