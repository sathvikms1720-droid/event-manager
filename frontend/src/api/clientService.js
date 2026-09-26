import API from "./clientApi";

export const getClients = () => API.get("/clients/");

export const addClient = (data) => API.post("/clients/", data);

export const updateClient = (id, data) =>
  API.put(`/clients/${id}`, data);

export const deleteClient = (id) =>
  API.delete(`/clients/${id}`);