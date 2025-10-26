import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://medtrax.me/api";
axios.defaults.withCredentials = true;

export const roleSelect = createAsyncThunk(
  "auth/roleSelect",
  async (role, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/select-role/`, {
        role: role,
      }); 

      if (response.data?.token)
        localStorage.setItem("token", response.data.token);
      if (response.data?.role) localStorage.setItem("role", response.data.role);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    console.log(userData);
    try {
      const payload = {
        email: userData.email,
        password1: userData.password1,
        password2: userData.password2,
      };

      const response = await axios.post(`${API_BASE_URL}/signup/`, payload);

      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error); 
      return rejectWithValue(error.response?.data || "Network error");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-signup-otp/`,
        otpData
      );
      
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(
        "OTP verification error:",
        error.response?.data || error.message
      );
     
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

export const resendSignupOtp = createAsyncThunk(
  "auth/resendSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resend-signup-otp/`, {
        email,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(
        "Resend signup OTP error:",
        error.response?.data || error.message
      );
      
      return rejectWithValue(error.response?.data || "Failed to resend OTP");
    }
  }
);

export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async ({ formData, role }, { rejectWithValue }) => {
    console.log(formData);
    try {
      if (!role) {
        return rejectWithValue("User role is missing. Please select a role.");
      }

      const endpoint =
        role === "doctor"
          ? `${API_BASE_URL}/complete-doctor-profile/`
          : `${API_BASE_URL}/complete-patient-profile/`;

      const response = await axios.post(endpoint, formData);
      console.log(response);
      return { ...response.data, role };
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data || "Profile completion failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials, role }, { rejectWithValue }) => {
    console.log(role);
    try {
      if (!role) {
        return rejectWithValue("User role is missing. Please select a role.");
      }

      const endpoint =
        role === "doctor"
          ? `${API_BASE_URL}/doctor-login/`
          : `${API_BASE_URL}/patient-login/`;

      const response = await axios.post(endpoint, credentials);
      console.log(response);
      return { ...response.data, role };
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password/`, {
        email,
      });
      console.log(response);
    } catch (error) {
      console.log("Forgot password error:", error);
      return rejectWithValue(error.response?.data || "error"); 
    }
});


export const verifyPasswordResetOtp = createAsyncThunk(
  "auth/verifyPasswordResetOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-password-reset-otp/`,
        { email, otp }
      );
      console.log("OTP verify response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Verify reset OTP error:", error);
      return rejectWithValue(error.response?.data || "Verification failed");
    }
  }
);


export const resendPasswordResetOtp = createAsyncThunk(
  "auth/resendPasswordResetOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/resend-password-reset-otp/`,
        { email }
      );
      console.log("Resend OTP response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Resend reset OTP error:", error);
      return rejectWithValue(error.response?.data || "Resend failed");
    }
  }
);


export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reset-password/`,
        data
      );
      console.log("Reset password success:", response.data);
      return response.data;
    } catch (error) {
      console.log("Reset password error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: "",
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.message = "";
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = "";
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.message = action.payload?.message || "Success";
          state.user = action.payload?.user ?? state.user;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload?.detail ||
            action.payload?.message ||
            action.payload ||
            "Something went wrong";
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
