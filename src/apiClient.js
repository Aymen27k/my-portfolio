import axios from "axios";
const api = axios.create({
  baseURL: "", // Your API base URL
});
//API INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config; // Important: Return the modified config
  },
  (error) => {
    return Promise.reject(error); // Handle errors
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Error :", error);

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Get the refresh token from the database (you'll need to implement this)
        const refreshToken = await getRefreshTokenFromDatabase(req.user.id); // req.user.id from the access token

        if (!refreshToken) {
          // Handle the case where the refresh token is not found (e.g., logout)
          localStorage.removeItem("accessToken");
          window.location = "/login"; // Or redirect as needed
          return Promise.reject(new Error("Refresh token not found"));
        }

        // 2. Call your refresh token endpoint (backend)
        const refreshResponse = await axios.post("/users/refresh_token", {
          token: refreshToken,
        });
        // Send the refresh token in the body
        const newAccessToken = refreshResponse.data.accessToken;

        // 3. Update access token in localStorage and headers
        localStorage.setItem("accessToken", newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // 4. Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token error (e.g., logout the user)
        localStorage.removeItem("accessToken");
        window.location = "/login"; // Or redirect as needed
        return Promise.reject(refreshError);
      }
    } else if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log("403 error caught. Attempting refresh token flow.");

      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const refreshToken = await getRefreshTokenFromDatabase(userId);
          if (!refreshToken) {
            // Handle the case where the refresh token is not found (e.g., logout)
            localStorage.removeItem("accessToken");
            window.location = "/login"; // Or redirect as needed
            return Promise.reject(new Error("Refresh token not found"));
          }
          const refreshResponse = await axios.post("/users/refresh_token", {
            token: refreshToken,
          });

          const newAccessToken = refreshResponse.data.accessToken;

          localStorage.setItem("accessToken", newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error("Error in refresh token request:", refreshError);
          // Handle refresh token error (e.g., logout user)
        }
      } else {
        console.log("No userId found in localStorage. Cannot refresh token.");
        // Handle the case where there's no userId (e.g., logout)
      }
    }

    return Promise.reject(error);
  }
);
async function getRefreshTokenFromDatabase(userId) {
  try {
    console.log("This is the user id being sent to the back : ", userId);
    const response = await api.get(`/users/${userId}/refresh_token`);
    return response.data.refreshToken;
  } catch (error) {
    console.error("Error fetching refresh token:", error);
    return null;
  }
}
export default api;
