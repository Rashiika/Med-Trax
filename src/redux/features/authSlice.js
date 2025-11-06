import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Helper functions for localStorage
const saveAuthToStorage = (user, role, isAuthenticated, isProfileComplete) => {
  try {
    localStorage.setItem('medtrax_user', JSON.stringify(user));
    localStorage.setItem('medtrax_role', role);
    localStorage.setItem('medtrax_isAuthenticated', JSON.stringify(isAuthenticated));
    localStorage.setItem('medtrax_isProfileComplete', JSON.stringify(isProfileComplete));
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem('medtrax_user');
    localStorage.removeItem('medtrax_role');
    localStorage.removeItem('medtrax_isAuthenticated');
    localStorage.removeItem('medtrax_isProfileComplete');
  } catch (error) {
    console.error('Error clearing auth from storage:', error);
  }
};

const loadAuthFromStorage = () => {
  try {
    const user = localStorage.getItem('medtrax_user');
    const role = localStorage.getItem('medtrax_role');
    const isAuthenticated = localStorage.getItem('medtrax_isAuthenticated');
    const isProfileComplete = localStorage.getItem('medtrax_isProfileComplete');
    
    if (user && role && isAuthenticated) {
      return {
        user: JSON.parse(user),
        role: role,
        isAuthenticated: JSON.parse(isAuthenticated),
        isProfileComplete: isProfileComplete ? JSON.parse(isProfileComplete) : false
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return null;
  }
};

export const selectRole = createAsyncThunk(
  "auth/selectRole",
  async (role, { rejectWithValue }) => {
    try {
      return role;
    } catch (error) {
      return rejectWithValue("Failed to set role");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { role } = getState().auth; 
      const payload = {
        email: userData.email,
        password1: userData.password1,
        password2: userData.password2,
        role: role, 
      };

      const response = await axiosInstance.post("/signup/", payload);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify-signup-otp/", otpData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

export const resendSignupOtp = createAsyncThunk(
  "auth/resendSignupOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/resend-signup-otp/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to resend OTP");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/forgot-password/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send reset email");
    }
  }
);

export const verifyPasswordResetOtp = createAsyncThunk(
  "auth/verifyPasswordResetOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verify-password-reset-otp/", otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

export const resendPasswordResetOtp = createAsyncThunk(
  "auth/resendPasswordResetOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/resend-password-reset-otp/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to resend OTP");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/reset-password/", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Password reset failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ credentials, role }, { rejectWithValue }) => {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password
      };
      const response = await axiosInstance.post("/login/", payload);
      console.log("Login Response:", response.data);
 
      if (response.data.success === false && response.data.is_profile_complete === false) {
        return rejectWithValue({
          isIncompleteProfile: true,
          is_profile_complete: false,
          role: response.data.role,
          email: response.data.email,
          message: response.data.message
        });
      }
      
      return {
        ...response.data,
        role: response.data.user?.role || role
      };
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData && errorData.is_profile_complete === false) {
        return rejectWithValue({
          isIncompleteProfile: true,
          is_profile_complete: false,
          role: errorData.role,
          email: errorData.email,
          message: errorData.message || "Please complete your profile."
        });
      }
      
      return rejectWithValue(
        errorData || { 
          message: error.message || 'Login failed',
          error: 'Login failed. Please try again.'
        }
      );
    }
  }
);

export const completeProfile = createAsyncThunk(
  "auth/completeProfile",
  async ({ formData, role }, { rejectWithValue }) => {
    try {
      const endpoint = role === "doctor" ? "/complete-doctor-profile/" : "/complete-patient-profile/";
      const response = await axiosInstance.post(endpoint, formData);
      return {
        ...response.data,
        role: role
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Profile completion failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    role: null,
    isAuthenticated: false,  // ✅ Changed from isProfileCompleted
    isProfileComplete: false, // ✅ Changed from isProfileCompleted
    loading: false,
    error: null,
    message: "",
    isHydrating: true, // Add this to track hydration state
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isProfileComplete = false;
      state.loading = false;
      state.error = null;
      state.message = "";
      state.isHydrating = false;
      clearAuthFromStorage();
    },
    
    hydrateAuth: (state) => {
      console.log("🔄 Hydrating auth from localStorage...");
      const savedAuth = loadAuthFromStorage();
      if (savedAuth) {
        console.log("✅ Auth data found in localStorage:", savedAuth);
        state.user = savedAuth.user;
        state.role = savedAuth.role;
        state.isAuthenticated = savedAuth.isAuthenticated;
        state.isProfileComplete = savedAuth.isProfileComplete;
      } else {
        console.log("❌ No auth data found in localStorage");
      }
      state.isHydrating = false; // Mark hydration as complete
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(selectRole.fulfilled, (state, action) => {
        state.role = action.payload;
      })
      
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Signup successful";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          email: action.payload.email,
          role: action.payload.role
        };
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.message = action.payload.message || "OTP verified successfully";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(resendSignupOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendSignupOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "OTP resent successfully";
      })      
      .addCase(resendSignupOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.isAuthenticated = true;  // ✅ Set to true
        state.isProfileComplete = true; // ✅ Set to true
        state.user = action.payload.user || {
          email: action.payload.email,
          role: action.payload.role
        };
        state.message = action.payload.message || "Login successful";
        
        console.log("💾 Saving auth to localStorage:", {
          user: state.user,
          role: state.role,
          isAuthenticated: state.isAuthenticated,
          isProfileComplete: state.isProfileComplete
        });
        
        // ✅ SAVE TO LOCALSTORAGE
        saveAuthToStorage(state.user, state.role, state.isAuthenticated, state.isProfileComplete);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isIncompleteProfile === true || 
            action.payload?.is_profile_complete === false) {
          state.isAuthenticated = true; // User is authenticated
          state.isProfileComplete = false; // But profile is not complete
          state.role = action.payload.role;
          state.user = {
            email: action.payload.email,
            role: action.payload.role
          };
          state.message = action.payload.message;
          state.error = null;
          
          // Save incomplete profile state
          saveAuthToStorage(state.user, state.role, true, false);
        } else {
          state.isAuthenticated = false;
          state.isProfileComplete = false;
          state.error = action.payload;
          state.message = action.payload?.message || action.payload?.error || "Login failed";
          clearAuthFromStorage();
        }
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password reset email sent";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(completeProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isProfileComplete = true;
        state.user = action.payload.user || {
          email: action.payload.user?.email,
          role: action.payload.user?.role,
          username: action.payload.user?.username
        };
        state.message = action.payload.message || "Profile completed successfully";
        
        // ✅ SAVE TO LOCALSTORAGE
        saveAuthToStorage(state.user, state.role, state.isAuthenticated, state.isProfileComplete);
      })
      .addCase(completeProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyPasswordResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPasswordResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "OTP verified successfully";
      })
      .addCase(verifyPasswordResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resendPasswordResetOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendPasswordResetOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "OTP resent successfully";
      })
      .addCase(resendPasswordResetOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;