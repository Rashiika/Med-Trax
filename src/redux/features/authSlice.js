import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://13.49.67.184/api";

/* ----------------------------- 1️⃣ Registration ----------------------------- */

export const registerUser = async ({ formData }) => {
  try {
    console.log(formData);
    const data = await axios.post(`${API_BASE_URL}/signup/`, formData);
    console.log(data);
    return data;
  } catch (error) {
    console.log("Registration error:", error);
    throw error;
  }
};

/* ----------------------------- 2️⃣ OTP Verification ----------------------------- */
export const verifyOtp = async ({ otpData }) => {
  try {
    const data = await axios.post(`${API_BASE_URL}/verify-signup-otp/`, otpData);
    return data;
  } catch (error) {
    console.log("OTP verification error:", error);
    throw error;
  }
};

export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async ({ formData, role }, { rejectWithValue }) => {
    try {
      
      if (!role) {
        return rejectWithValue("User role is missing. Please select a role.");
      }

      const endpoint =
        role === "doctor"
          ? `${API_BASE_URL}/complete-doctor-profile/`
          : `${API_BASE_URL}/complete-patient-profile/`;

      const response = await axios.post(endpoint, formData);
      return { ...response.data, role };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile completion failed");
    }
  }
);

/* ----------------------------- 4️⃣ Login ----------------------------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials, role }, { rejectWithValue }) => {
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
export const forgotPassword = async ({ email }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password/`, { email });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Forgot password error:", error);
    throw error;
  }
};

/* ----------------------------- 6️⃣ Reset Password ----------------------------- */
export const resetPassword = async ({ data }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password/`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Reset password error:", error);
    throw error; 
  }
};

export const verifyPasswordResetOtp = async ({ otpData }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-reset-otp/`, otpData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Verify reset OTP error:", error);
    throw error;
  }
};

export const resendPasswordResetOtp = async ({ email }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resend-reset-otp/`, { email });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Resend reset OTP error:", error);
    throw error; 
  }
};

export const resendSignupOtp = async ({ email }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/resend-signup-otp/`, { email });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Resend signup OTP error:", error);
    throw error; 
  }
}

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