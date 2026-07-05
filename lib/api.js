import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: API_BASE_URL });

// Books
export const listBooks = (params) => api.get("/books/", { params });
export const createBook = (data) => api.post("/books/", data);
export const updateBook = (id, data) => api.patch(`/books/${id}/`, data);
export const deleteBook = (id) => api.delete(`/books/${id}/`);

// Members
export const listMembers = (params) => api.get("/members/", { params });
export const createMember = (data) => api.post("/members/", data);
export const updateMember = (id, data) => api.patch(`/members/${id}/`, data);
export const memberBorrowedBooks = (id) => api.get(`/members/${id}/borrowed-books/`);

// Borrow records
export const listBorrowRecords = (params) => api.get("/borrow-records/", { params });
export const borrowBook = (bookId, memberId) =>
  api.post("/borrow-records/", { book: bookId, member: memberId });
export const returnBook = (recordId, notes = "") =>
  api.post(`/borrow-records/${recordId}/return/`, { notes });
export const listOverdue = () => api.get("/borrow-records/overdue/");

export default api;
