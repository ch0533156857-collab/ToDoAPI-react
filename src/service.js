import axios from 'axios';

// -----------------------------
// 1️⃣ יצירת אינסטנס עם baseURL
// -----------------------------
const api = axios.create({
baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5106',
});

// -----------------------------
// 2️⃣ interceptor לשגיאות
// -----------------------------
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

// -----------------------------
// 3️⃣ פונקציות API
// -----------------------------
export default {
  // שליפת כל המשימות
  getTasks: async () => {
    const result = await api.get('/tasks');
    return result.data;
  },

  // הוספת משימה חדשה
  addTask: async (name) => {
    const newItem = { name, isComplete: false };
    const result = await api.post('/tasks', newItem);
    return result.data;
  },

  // עדכון סטטוס משימה
  setCompleted: async (id, isComplete) => {
    const updatedItem = { isComplete };
    const result = await api.put(`/tasks/${id}`, updatedItem);
    return result.data;
  },

  // מחיקת משימה
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};
