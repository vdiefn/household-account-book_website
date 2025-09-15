import axios from "axios";
import { ElMessage } from "element-plus";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let message = "";
    const status = error.response?.status || 0;
    switch (status) {
      case 401:
        message = "token過期";
        break;
      case 403:
        message = "無權訪問";
        break;
      case 404:
        message = "請求地址錯誤";
        break;
      case 500:
        message = "伺服器出現問題";
        break;
      default:
        message = "網路異常";
    }
    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(error);
  },
);

export default api;
