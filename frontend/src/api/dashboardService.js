import API from "./clientApi";

export const getDashboard = () => API.get("/dashboard/");