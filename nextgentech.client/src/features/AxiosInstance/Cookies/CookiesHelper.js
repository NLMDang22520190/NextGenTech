import Cookies from 'js-cookie';

// Hàm để lưu auth cookies
export const setAuthCookies = (userId, token, userRole) => {
    Cookies.set("userID", userId, { expires: 7, path: "/" }); // Lưu trong 7 ngày
    Cookies.set("authToken", token, { expires: 7, path: "/" });
    Cookies.set("userRole", userRole, { expires: 7, path: "/" });
  };
  
  // Hàm để lấy auth cookies
  export const getAuthCookies = () => {
    return {
      userID: Cookies.get("userID") || null,
      token: Cookies.get("authToken") || null,
      userRole: Cookies.get("userRole") || null,
    };
  };
  
  // Hàm để xóa auth cookies
  export const clearAuthCookies = () => {
    Cookies.remove("userID", { path: "/" });
    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("userRole", { path: "/" });
  };