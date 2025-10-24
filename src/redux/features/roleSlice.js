import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';

export const selectRole = createAsyncThunk(
  'role/selectRole',
  async (role, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/select-role/', { role });
      localStorage.setItem('selected_role', role);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { error: 'Failed to select role' });
    }
  }
);

export const clearRole = createAsyncThunk(
  'role/clearRole',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/clear-role/');
      localStorage.removeItem('selected_role');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data ?? { error: 'Failed to clear role' });
    }
  }
);


const roleSlice = createSlice({
  name: 'role',
  initialState: {
    selectedRole: localStorage.getItem('selected_role') || null,
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    setRole: (state, action) => {
      state.selectedRole = action.payload;
      localStorage.setItem('selected_role', action.payload);
    },
    resetRoleState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(selectRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(selectRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedRole = action.payload.role || localStorage.getItem('selected_role');
        state.success = true;
      })
      .addCase(selectRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Role selection failed';
      })

    
      .addCase(clearRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearRole.fulfilled, (state) => {
        localStorage.removeItem('selected_role');
        state.isLoading = false;
        state.selectedRole = null;
        state.success = false;
        state.error = null;
      })
      .addCase(clearRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.error || 'Failed to clear role';
      });
  },
});

export const { setRole, resetRoleState } = roleSlice.actions;
export default roleSlice.reducer;
