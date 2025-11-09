import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";


export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/conversations/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch conversations");
    }
  }
);

export const fetchChatDoctors = createAsyncThunk(
  "chat/fetchChatDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/doctors/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctors list");
    }
  }
);

export const fetchChatPatients = createAsyncThunk(
  "chat/fetchChatPatients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/patients/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patients list");
    }
  }
);

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/history/${userId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat history");
    }
  }
);

export const deleteChatMessage = createAsyncThunk(
  "chat/deleteChatMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chat/messages/${messageId}/delete/`);
      return messageId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete message");
    }
  }
);

export const searchChatUsers = createAsyncThunk(
  "chat/searchChatUsers",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/search/?q=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to search chat users");
    }
  }
);

export const fetchUnreadByConversation = createAsyncThunk(
  "chat/fetchUnreadByConversation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/unread-by-conversation/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch unread data");
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "chat/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/unread-count/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch unread count");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    chatDoctors: [],
    chatPatients: [],
    currentChat: [],
    unreadByConversation: [],
    unreadCount: 0,
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChatHistory: (state) => {
      state.currentChat = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchChatDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.chatDoctors = action.payload;
      })
      .addCase(fetchChatPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.chatPatients = action.payload;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = action.payload;
      })
      .addCase(deleteChatMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChat = state.currentChat.filter(
          (msg) => msg.id !== action.payload
        );
      })
      .addCase(searchChatUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchUnreadByConversation.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadByConversation = action.payload;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.count || 0;
      })

      .addMatcher(
        (action) => action.type.startsWith("chat/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("chat/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearChatHistory } = chatSlice.actions;
export default chatSlice.reducer;
