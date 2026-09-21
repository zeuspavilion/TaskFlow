import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For Android emulator, 10.0.2.2 maps to host machine's localhost
// For iOS simulator, localhost works
// For physical device, replace with your local machine's IP (e.g., http://192.168.1.5:5000/api)
export const DEFAULT_BASE_URL = 'http://127.0.0.1:5000/api';
export const WIFI_BASE_URL = 'http://192.168.1.29:5000/api';

export const TOKEN_STORAGE_KEY = '@todo_app_auth_token';
export const USER_STORAGE_KEY = '@todo_app_auth_user';
export const SERVER_URL_KEY = '@todo_app_server_url';

let activeBaseUrl = DEFAULT_BASE_URL;

const apiClient = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Check if custom server URL is set
      const customUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
      if (customUrl) {
        config.baseURL = customUrl;
      }

      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading token from storage:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth expiration handling and auto network failover
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
    } else if (!error.response && error.config && !error.config._retry) {
      // Network error: automatically switch between USB (127.0.0.1) and Wi-Fi (192.168.1.29)
      error.config._retry = true;
      const nextBase = error.config.baseURL === DEFAULT_BASE_URL ? WIFI_BASE_URL : DEFAULT_BASE_URL;
      error.config.baseURL = nextBase;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
