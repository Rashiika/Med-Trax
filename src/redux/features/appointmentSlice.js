import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchPatientStats = createAsyncThunk(
  "appointment/fetchPatientStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/patient/dashboard/stats/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient stats");
    }
  }
);

export const fetchPatientAppointments = createAsyncThunk(
  "appointment/fetchPatientAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/patient/dashboard/appointments/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient appointments");
    }
  }
);

export const fetchPatientRecentAppointments = createAsyncThunk(
  "appointment/fetchPatientRecentAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/patient/dashboard/appointments/recent/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient recent appointments");
    }
  }
);

export const fetchAvailableDoctors = createAsyncThunk(
  "appointment/fetchAvailableDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/doctors/available/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch available doctors");
    }
  }
);

export const fetchDoctorStats = createAsyncThunk(
  "appointment/fetchDoctorStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/doctor/dashboard/stats/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor stats");
    }
  }
);

export const fetchDoctorWeeklyStats = createAsyncThunk(
  "appointment/fetchDoctorWeeklyStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/doctor/dashboard/stats/weekly/`);
      console.log("Weekly stats response:", response);
      return response.data;
    } catch (error) {
      console.log("Weekly stats error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch doctor weekly stats");
    }
  }
);

export const bookAppointment = createAsyncThunk(
  "appointment/bookAppointment",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/appointments/patient/book/`, appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to book appointment");
    }
  }
);

export const fetchDoctorSlots = createAsyncThunk(
  "appointment/fetchDoctorSlots",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/doctors/${doctorId}/available-slots/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor slots");
    }
  }
);

export const fetchDoctorRequests = createAsyncThunk(
  "appointment/fetchDoctorRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/doctor/requests/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor requests");
    }
  }
);

// ✅ FIXED - Using requestId instead of appointmentId
export const acceptAppointmentRequest = createAsyncThunk(
  "appointment/acceptAppointmentRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      console.log("🔄 Accepting appointment:", requestId);
      const response = await axiosInstance.patch(`/appointments/doctor/${requestId}/accept/`);
      console.log("✅ Accept response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Accept error:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to accept appointment request");
    }
  }
);

// ✅ FIXED - Using requestId instead of appointmentId
export const rejectAppointmentRequest = createAsyncThunk(
  "appointment/rejectAppointmentRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      console.log("🔄 Rejecting appointment:", requestId);
      const response = await axiosInstance.patch(`/appointments/doctor/${requestId}/reject/`);
      console.log("✅ Reject response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Reject error:", error.response?.data || error);
      return rejectWithValue(error.response?.data || "Failed to reject appointment request");
    }
  }
);

export const fetchDoctorConfirmedAppointments = createAsyncThunk(
  "appointment/fetchDoctorConfirmedAppointments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/appointments/doctor/appointments/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor confirmed appointments");
    }
  }
);

export const fetchDoctorRecentReviews = createAsyncThunk(
  "appointment/fetchDoctorRecentReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/doctor/dashboard/reviews/recent/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch recent reviews");
    }
  }
);

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    patientStats: null,
    doctorStats: null,
    doctorWeeklyStats: null,
    upcomingAppointments: [],
    recentAppointments: [],
    doctorRecentReviews: [],
    doctorAppointments: [],
    requests: [],
    availableDoctors: [],
    doctorSlots: {},
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearAppointmentMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientStats.fulfilled, (state, action) => {
        state.loading = false;
        state.patientStats = action.payload;
      })
      .addCase(fetchPatientAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.upcomingAppointments = action.payload;
      })
      .addCase(fetchPatientRecentAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.recentAppointments = action.payload;
      })
      .addCase(fetchDoctorRecentReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorRecentReviews = action.payload;
      })
      .addCase(fetchAvailableDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.availableDoctors = action.payload;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || "Appointment booked successfully!";
      })
      .addCase(fetchDoctorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorStats = action.payload;
      })
      .addCase(fetchDoctorWeeklyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorWeeklyStats = action.payload;
      })
      .addCase(fetchDoctorConfirmedAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorAppointments = action.payload;
      })
      .addCase(fetchDoctorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchDoctorSlots.fulfilled, (state, action) => {
        state.loading = false;
      })
      
      // ✅ FIXED - Properly access nested appointment object
      .addCase(acceptAppointmentRequest.fulfilled, (state, action) => {
        state.loading = false;
        
        // API returns: { message: "...", appointment: {...} }
        const acceptedAppointment = action.payload.appointment;
        
        // Remove from pending requests
        state.requests = state.requests.filter(req => req.id !== acceptedAppointment.id);
        
        // Add to confirmed appointments
        state.doctorAppointments.push(acceptedAppointment);
        
        // Set success message
        state.message = action.payload.message || "Appointment accepted successfully!";
        state.error = null;
      })
      
      // ✅ FIXED - Properly access nested appointment object
      .addCase(rejectAppointmentRequest.fulfilled, (state, action) => {
        state.loading = false;
        
        // API returns: { message: "...", appointment: {...} }
        const rejectedAppointment = action.payload.appointment;
        
        // Remove from pending requests
        state.requests = state.requests.filter(req => req.id !== rejectedAppointment.id);
        
        // Set success message
        state.message = action.payload.message || "Appointment rejected successfully!";
        state.error = null;
      })
      
      // Handle all pending states
      .addMatcher(
        (action) => action.type.startsWith('appointment/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      
      // Handle all rejected states
      .addMatcher(
        (action) => action.type.startsWith('appointment/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.message = null;
        }
      );
  }
});

export const { clearAppointmentMessage } = appointmentSlice.actions;
export default appointmentSlice.reducer;