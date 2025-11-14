import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ==================== PATIENT ENDPOINTS ====================
export const fetchPatientChats = createAsyncThunk(
  "chat/fetchPatientChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/patient/doctors/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient chats");
    }
  }
);

// ==================== DOCTOR ENDPOINTS ====================
export const fetchDoctorPatients = createAsyncThunk(
  "chat/fetchDoctorPatients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/doctor/patients/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor patients");
    }
  }
);

export const fetchDoctorDoctors = createAsyncThunk(
  "chat/fetchDoctorDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/doctor/doctors/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor chats");
    }
  }
);

export const searchDoctors = createAsyncThunk(
  "chat/searchDoctors",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/doctor/search/?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search doctors");
    }
  }
);

export const sendConnectionRequest = createAsyncThunk(
  "chat/sendConnectionRequest",
  async (toDoctorId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/doctor/connection/send/`, {
        to_doctor_id: toDoctorId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to send connection request");
    }
  }
);

export const fetchPendingRequests = createAsyncThunk(
  "chat/fetchPendingRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/doctor/connection/pending/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch pending requests");
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "chat/acceptConnectionRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/doctor/connection/${requestId}/accept/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to accept request");
    }
  }
);

export const rejectConnectionRequest = createAsyncThunk(
  "chat/rejectConnectionRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/doctor/connection/${requestId}/reject/`);
      return { requestId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to reject request");
    }
  }
);

// ==================== CHAT ROOM ENDPOINTS ====================
export const fetchChatRoomDetails = createAsyncThunk(
  "chat/fetchChatRoomDetails",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/rooms/${roomId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat room details");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ roomId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/chat/rooms/${roomId}/messages/`,
        { content }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send message"
      );
    }
  }
);


export const markAsRead = createAsyncThunk(
  "chat/markAsRead",
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/rooms/${roomId}/read/`);
      return { roomId };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to mark as read");
    }
  }
);

// ==================== SLICE ====================
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    patientChats: [],
    doctorPatients: [],
    doctorDoctors: [],
    currentChatRoom: null,
    currentMessages: [],
    searchResults: [],
    pendingRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentChat: (state) => {
      state.currentChatRoom = null;
      state.currentMessages = [];
    },
    addMessageToCurrentChat: (state, action) => {
      if (state.currentMessages) {
        state.currentMessages.push(action.payload);
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Patient chats
      .addCase(fetchPatientChats.fulfilled, (state, action) => {
        state.loading = false;
        state.patientChats = action.payload;
      })
      // Doctor patients
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorPatients = action.payload;
      })
      // Doctor doctors
      .addCase(fetchDoctorDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorDoctors = action.payload;
      })
      // Search doctors
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      // Send connection request
      .addCase(sendConnectionRequest.fulfilled, (state) => {
        state.loading = false;
      })
      // Fetch pending requests
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = action.payload;
      })
      // Accept connection
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          (req) => req.id !== action.payload.id
        );
      })
      // Reject connection
      .addCase(rejectConnectionRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRequests = state.pendingRequests.filter(
          (req) => req.id !== action.payload.requestId
        );
      })
      // Fetch chat room details
      .addCase(fetchChatRoomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChatRoom = action.payload;
        state.currentMessages = action.payload.messages || [];
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentMessages) {
          state.currentMessages.push(action.payload);
        }
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state) => {
        state.loading = false;
      })
      // Loading states
      .addMatcher(
        (action) => action.type.startsWith("chat/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Error states
      .addMatcher(
        (action) => action.type.startsWith("chat/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearCurrentChat, addMessageToCurrentChat, clearSearchResults } = chatSlice.actions;
export default chatSlice.reducer;