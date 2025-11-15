import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../../api/axiosInstance";
import axios from "axios"; // used for multipart/form-data when needed

// -------------------------------------------------------------------
// CONSTANTS
// -------------------------------------------------------------------
const API_BASE_URL = "https://medtrax.me/api";

// -------------------------------------------------------------
// ALWAYS return Bearer token when required
// -------------------------------------------------------------
const getAuthToken = () => {
  const token = localStorage.getItem('access') || localStorage.getItem('access_token');
  return token ? `Bearer ${token}` : '';
};

// -------------------------------------------------------------
// FETCH CATEGORIES
// -------------------------------------------------------------
export const fetchCategories = createAsyncThunk(
  'community/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/community/categories/`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// FETCH POSTS
// -------------------------------------------------------------
export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async (category = null, { rejectWithValue }) => {
    try {
      const url = category ? `/community/posts/?category=${category}` : `/community/posts/`;
      const response = await axiosInstance.get(url);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// FETCH SINGLE POST DETAILS
// -------------------------------------------------------------
export const fetchPostDetail = createAsyncThunk(
  'community/fetchPostDetail',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/community/posts/${slug}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// CREATE POST
// Use axios (not axiosInstance) to ensure multipart/form-data boundary handled correctly.
// You can also use axiosInstance but do NOT set Content-Type manually (let browser set boundary).
// -------------------------------------------------------------
export const createPost = createAsyncThunk(
  'community/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      // prefer axiosInstance to reuse interceptors, but don't set Content-Type manually
      const config = {
        headers: {
          Authorization: getAuthToken(),
          // do NOT set 'Content-Type' here for multipart — let axios/browser set the boundary
        },
        withCredentials: true
      };

      // Use axios (base full url) to avoid issues if axiosInstance baseURL differs
      const response = await axios.post(`${API_BASE_URL}/community/posts/create/`, formData, config);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// DELETE POST
// -------------------------------------------------------------
export const deletePost = createAsyncThunk(
  'community/deletePost',
  async (slug, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/community/posts/${slug}/`);
      return slug;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// LIKE / UNLIKE POST
// -------------------------------------------------------------
export const toggleLikePost = createAsyncThunk(
  'community/toggleLikePost',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/community/posts/${slug}/like/`);
      return { slug, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------
// FETCH MY POSTS
// -------------------------------------------------------------
export const fetchMyPosts = createAsyncThunk(
  'community/fetchMyPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/community/posts/my-posts/`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// -------------------------------------------------------------------
// SLICE
// -------------------------------------------------------------------

const communitySlice = createSlice({
  name: 'community',
  initialState: {
    categories: [],
    posts: [],
    myPosts: [],
    currentPost: null,

    loading: false,
    detailLoading: false,
    createLoading: false,

    error: null,
    createError: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },

  // -------------------------------------------------------------------
  // EXTRA REDUCERS
  // -------------------------------------------------------------------
  extraReducers: (builder) => {
    builder

      // --------------------------
      // CATEGORIES
      // --------------------------
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })

      // --------------------------
      // POSTS LIST
      // --------------------------
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.posts = [];
      })

      // --------------------------
      // SINGLE POST DETAILS
      // --------------------------
      .addCase(fetchPostDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      // --------------------------
      // CREATE POST
      // --------------------------
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;

        // Backend returns { success: true, message, post: {...} } often.
        // Accept both: action.payload.post or action.payload (if backend returns post directly).
        const newPost = action.payload?.post ?? (action.payload && action.payload.id ? action.payload : null);

        if (newPost) {
          if (!Array.isArray(state.posts)) state.posts = [];
          // insert at front without mutating other types
          state.posts = [newPost, ...state.posts];
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // --------------------------
      // DELETE POST
      // --------------------------
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.slug !== action.payload);
        state.myPosts = state.myPosts.filter(p => p.slug !== action.payload);
      })

      // --------------------------
      // LIKE POST
      // --------------------------
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { slug, is_liked, total_likes } = action.payload;

        const index = state.posts.findIndex(p => p.slug === slug);
        if (index !== -1) {
          state.posts[index].is_liked = is_liked;
          state.posts[index].total_likes = total_likes;
        }

        if (state.currentPost?.slug === slug) {
          state.currentPost.is_liked = is_liked;
          state.currentPost.total_likes = total_likes;
        }
      })

      // --------------------------
      // MY POSTS
      // --------------------------
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.myPosts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.myPosts = [];
      });
  },
});

export const { clearError, clearCurrentPost } = communitySlice.actions;
export default communitySlice.reducer;