import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  let response;
  try {
    response = await api.post("/login", data);
  } catch (error) {
    return error;
  }
  return response;
};
export const register = async (data) => {
  let response;
  try {
    response = await api.post("/register", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const getBlog = async () => {
  let response;
  try {
    response = await api.get("/blog/all");
  } catch (error) {
    return error;
  }
  return response;
};

export const logout = async () => {
  let response;
  try {
    response = await api.post("/logout");
  } catch (error) {
    return error;
  }
  return response;
};

export const submitBlog = async (data) => {
  let response;
  try {
    response = await api.post("/blog", data);
  } catch (error) {
    return error;
  }
  return response;
};
export const getBlogById = async (id) => {
  let response;
  try {
    response = await api.get(`/blog/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};
export const deleteBlog = async (id) => {
  let response;
  try {
    response = await api.delete(`/blog/delete/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};
export const updateBlog = async (data) => {
  let response;
  try {
    response = await api.put("/blog/update", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const createComment = async (data) => {
  let response;
  try {
    response = await api.post("/comment", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const getCommentById = async (id) => {
  let response;
  try {
    response = await api.get(`/comment/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};
