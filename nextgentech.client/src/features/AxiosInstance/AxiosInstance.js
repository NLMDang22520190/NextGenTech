// import axios from "axios";
// import {
//   getAuthFromCookies,
//   clearAuthCookies,
// } from "../CookieHelper/CookieHelper";
// import { message } from "antd";

// const productURL = "https://healthbuddy-gkgc.onrender.com";
// const developmentURL = "https://localhost:7222";

// const baseURL =
//   process.env.NODE_ENV === "production" ? productURL : developmentURL;

// const instance = axios.create({
//   baseURL: baseURL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json; charset=utf-8",
//   },
// });

// // Interceptor cho requests
// instance.interceptors.request.use(
//   (config) => {
//     const authCookies = getAuthFromCookies();
//     if (authCookies.token) {
//       config.headers["Authorization"] = `Bearer ${authCookies.accessToken}`;
//     }

//     // Đảm bảo signal được truyền qua nếu có
//     if (config.signal) {
//       // Thêm listener để xử lý khi request bị hủy
//       config.signal.addEventListener("abort", () => {
//         // Có thể thêm logic cleanup nếu cần
//       });
//     }

//     return config;
//   },
//   (error) => {
//     console.error("Request error:", error);
//     return Promise.reject(error);
//   }
// );

// // Interceptor cho responses
// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Kiểm tra xem lỗi có phải do request bị hủy không
//     if (axios.isCancel(error)) {
//       // Trả về một error đặc biệt cho cancelled requests
//       const cancelError = new Error("Request was cancelled");
//       cancelError.name = "AbortError";
//       return Promise.reject(cancelError);
//     }

//     if (error.response) {
//       error.customData = error.response.data;
//     }
//     return Promise.reject(error);
//   }
// );

// export default instance;

// // Thêm một utility function để tạo request có thể hủy
// export const createCancellableRequest = (requestFn) => {
//   const controller = new AbortController();
//   const promise = requestFn(controller.signal);
//   return {
//     promise,
//     controller,
//   };
// };
