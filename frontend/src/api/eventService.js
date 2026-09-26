import API from "./clientApi";

export const getEvents = () => API.get("/events/");

export const addEvent = (data) =>
  API.post("/events/", data);

export const updateEvent = (id, data) =>
  API.put(`/events/${id}`, data);

export const deleteEvent = (id) =>
  API.delete(`/events/${id}`);