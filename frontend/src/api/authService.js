import axios from "axios";

const API = axios.create({
  baseURL: "https://event-manager-pls6.onrender.com",
});

export const loginUser = async (email, password) => {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  // Save the logged-in user's token
  const token = response.data.access_token;

  if (token) {
    localStorage.setItem("access_token", token);
  }

  return response.data;
};

export const registerUser = async (
  full_name,
  email,
  phone,
  password
) => {
  const response = await API.post("/auth/register", {
    full_name,
    email,
    phone,
    password,
  });

  return response.data;
};