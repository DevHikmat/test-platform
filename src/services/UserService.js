import { axiosInstance } from "./axiosInstance";

export const UserService = {
  async getAllUsers() {
    const res = await axiosInstance.get("/user");
    return res.data;
  },
  async getOneUser(id) {
    const res = await axiosInstance.get(`/user/${id}`);
    return res.data;
  },
  async deleteUser(id) {
    const res = await axiosInstance.delete(`/user/${id}`);
    return res.data;
  },
  async updateUser(id, user) {
    const res = await axiosInstance.put(`/user/${id}`, user);
    return res.data;
  },
};
