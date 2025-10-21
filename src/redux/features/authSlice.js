import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://13.49.67.184/api";

/* ----------------------------- 1️⃣ Registration ----------------------------- */

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    console.log(userData);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup/`, userData);
      console.log(response);
      return response.data; 
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

/* -------------------------- Verify OTP Thunk -------------------------- */
// Takes the whole formData: { email: '...', otp: '...' }
export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-signup-otp/`, otpData);
      // Return the data on success
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("OTP verification error:", error.response?.data || error.message);
      // Return the detailed error data for the component to handle
      return rejectWithValue(error.response?.data || 'OTP verification failed');
    }
  }
);

/* -------------------------- Resend OTP Thunk -------------------------- */
// Takes an object: { email: '...' }
export const resendSignupOtp = createAsyncThunk(
  'auth/resendSignupOtp',
  async ({ email }, { rejectWithValue }) => {
    try {
      // API expects an object { email: 'user@example.com' }
      const response = await axios.post(`${API_BASE_URL}/resend-signup-otp/`, { email });
      // Return the data on success
      console.log(response);
      return response.data;
    } catch (error) {
      console.log("Resend signup OTP error:", error.response?.data || error.message);
      // Return the detailed error data
      return rejectWithValue(error.response?.data || 'Failed to resend OTP');
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
      return rejectWithValue(error.response?.data || "Profile completion failed");
    }
  }
);

/* ----------------------------- 4️⃣ Login ----------------------------- */
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

/* ----------------------------- 5️⃣ Forgot Password ----------------------------- */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password/`, { email });
      console.log(response);
      return response.data; // ✅ Data goes to fulfilled case
    } catch (error) {
      console.log("Forgot password error:", error);
      return rejectWithValue(error.response?.data || "error"); // ❌ Triggers rejected case
    }
  }
);

// ✅ Verify OTP Thunk
export const verifyPasswordResetOtp = createAsyncThunk(
  "auth/verifyPasswordResetOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-password-reset-otp/`, { email, otp });
      console.log("OTP verify response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Verify reset OTP error:", error);
      return rejectWithValue(error.response?.data || "Verification failed");
    }
  }
);

// ✅ Resend OTP Thunk
export const resendPasswordResetOtp = createAsyncThunk(
  "auth/resendPasswordResetOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/resend-password-reset-otp/`, { email });
      console.log("Resend OTP response:", response.data);
      return response.data;
    } catch (error) {
      console.log("Resend reset OTP error:", error);
      return rejectWithValue(error.response?.data || "Resend failed");
    }
  }
);

/* ----------------------------- 6️⃣ Reset Password ----------------------------- */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password/`, data);
      console.log("Reset password success:", response.data);
      return response.data;
    } catch (error) {
      console.log("Reset password error:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



/* ----------------------------- 🔹 Slice ----------------------------- */
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
      localStorage.removeItem("token");
      localStorage.removeItem("role"); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
          state.message = "";
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          state.message = action.payload?.message || "Success";

          if (action.payload?.role) {
            localStorage.setItem("role", action.payload.role);
          }
          
          if (action.payload?.token) {
            localStorage.setItem("token", action.payload.token);
          }
          
          state.user = action.payload?.user || action.payload; 
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("auth/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.detail || action.payload?.message || action.payload || "Something went wrong";
        }
      );
  },
});

export const { logout } = authSlice.actions; 
export default authSlice.reducer;