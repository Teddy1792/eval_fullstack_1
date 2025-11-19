// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// ----- CATEGORIES -----
export const getCategories = async () => {
  const res = await api.get("/categories/");
  return res.data;
};

export const createCategory = async (name) => {
  const res = await api.post("/categories/", { name });
  return res.data;
};

// ----- TASKS -----
export const getTasks = async () => {
  const res = await api.get("/tasks/");
  return res.data;
};

export const createTask = async (data) => {
  const res = await api.post("/tasks/", data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await api.patch(`/tasks/${id}/`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}/`);
};
