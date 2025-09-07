// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "https://quillpad-bcj3.onrender.com/", // match your backend route
});

// Example requests
export const getNotes = () => API.get("/notes");
export const createNote = (data: any) => API.post("/notes", data);
export const updateNote = (id: string, data: any) => API.put(`/notes/${id}`, data);
export const deleteNote = (id: string) => API.delete(`/notes/${id}`);

export default API;
