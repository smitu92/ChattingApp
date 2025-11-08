import { useAppStore } from "../../src/store/appStore";


export const setupInterceptors = (axiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAppStore.getState().accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Request:', config.method.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Response:', response.status, response.config.url);
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (token refresh logic)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
        //   const refreshToken = localStorage.getItem('refreshToken');
           const res=await axiosInstance.get(`/authservice/refresh`,{ withCredentials:true});
           useAppStore.getItem().setAccessToken(res.accessToken);
           const token=res.accessToken;
           console.log(res,"token","from Interceptors");
        //    const { token } = response.data;
          
        //   localStorage.setItem('token', token);
          originalRequest.headers['Authorization'] = `Bearer ${token}`; 
          
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      console.error('Response Error:', error.response?.status);
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
