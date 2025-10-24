import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const getTokenFromStorage = () => {
  return localStorage.getItem("access_token") || null;
};

const initialState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
  isLoading: false,
  error: null,
  refresh_token: localStorage.getItem("refresh_token") || null, 
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login/", credentials); 
      
      if (response.data.access && response.data.user) {
        const { access, refresh, user } = response.data;
        
        localStorage.setItem("access_token", access);
        if (refresh) {
             localStorage.setItem("refresh_token", refresh);
        }
        localStorage.setItem("user", JSON.stringify(user));

        return { user, access, refresh };
      } else {
        console.error("Login response missing token or user data:", response.data);
        return rejectWithValue("Login failed: Invalid server response.");
      }
    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
      const errorMsg = 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.response?.data?.message ||
        "Login failed. Please try again.";
      return rejectWithValue(errorMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("selected_role");
      sessionStorage.clear();
      
      try {
        await axiosInstance.post("/logout/"); 
      } catch (err) {
        console.log("Backend logout may not be available or token expired:", err);
      }
      
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed during cleanup");
    }
  }
);

export const verifyOtp = async ({ otpData }) => {
    const response = await axiosInstance.post(`/verify-signup-otp/`, otpData); 
    return response.data;
};

export const resendSignupOtp = async ({ email }) => {
    const response = await axiosInstance.post("/resend-signup-otp/", { email });
    return response.data; 
};

export const forgotPassword = async ({ email }) => {
    const response = await axiosInstance.post("/forgot-password/", { email });
    return response.data;
};

export const verifyPasswordResetOtp = async ({ otpData }) => {
    const response = await axiosInstance.post(`/verify-password-reset-otp/`, otpData);
    return response.data;
};

export const resetPassword = async ({ data }) => {
    const response = await axiosInstance.post(`/reset-password/`, data);
    return response.data;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.error = null;
      state.isLoading = false;
    },
    updateUserAfterProfileCompletion: (state, action) => { 
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user; 
        state.token = action.payload.access;
        state.refresh_token = action.payload.refresh;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refresh_token = null;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refresh_token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
    resetAuthState, 
    clearAuthError, 
    updateUserAfterProfileCompletion 
} = authSlice.actions;

export default authSlice.reducer;