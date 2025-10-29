const saveTokensToLocalStorage = (access, refresh) => {
  if (access) localStorage.setItem("accessToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

const getTokensFromLocalStorage = () => {
  return {
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  };
};

const clearTokensFromLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

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
      
      return {
        ...response.data,
        role: response.data.user?.role || role
      };
    } catch (error) {
      const errorData = error.response?.data;
      
      if (errorData?.is_profile_complete === false) {
        return rejectWithValue({
          ...errorData,
          isIncompleteProfile: true 
        });
      }
      
  
      return rejectWithValue(errorData || { message: "Login failed" });
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
  isProfileCompleted: false,
  loading: false,
  error: null,
  message: "",
},

 reducers: {
  logout: (state) => {
    state.user = null;
    state.role = null;
    state.isProfileCompleted = false;
    state.loading = false;
    state.error = null;
    state.message = "";
    
    clearTokensFromLocalStorage();
  },
  hydrateAuth: (state, action) => {
    const { accessToken, refreshToken } = getTokensFromLocalStorage();
    

    if (accessToken && refreshToken) {
      state.isProfileCompleted = true;
      state.user = action.payload?.user || state.user;
      state.role = action.payload?.role || state.role;
    }
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
   state.isProfileCompleted = action.payload.is_profile_complete !== false;


   if (action.payload.access_token && action.payload.refresh_token) {
     saveTokensToLocalStorage(action.payload.access_token, action.payload.refresh_token);
     state.isProfileCompleted = true;
   }

   state.user = action.payload.user || {
     email: action.payload.email,
     role: action.payload.role
   };
   state.message = action.payload.message || "Login successful";
})
      .addCase(loginUser.rejected, (state, action) => {
  state.loading = false;
  
  if (action.payload?.isIncompleteProfile) {
    state.isProfileCompleted = false;
    state.role = action.payload.role;
    state.user = {
      email: action.payload.email,
      role: action.payload.role
    };
    state.message = action.payload.message;
    state.error = null; 
  } else {
    state.error = action.payload;
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
  state.isProfileCompleted = true;

  saveTokensToLocalStorage(action.payload.access_token, action.payload.refresh_token);
  
  state.user = action.payload.user || {
    email: action.payload.user?.email,
    role: action.payload.user?.role,
    username: action.payload.user?.username
  };
  state.message = action.payload.message || "Profile completed successfully";
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
