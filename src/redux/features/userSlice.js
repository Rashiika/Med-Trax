import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchPatientProfile = createAsyncThunk(
    "user/fetchPatientProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/patient/dashboard/profile/complete/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch user profile");
        }
    }
);

export const fetchRecentReviews = createAsyncThunk(
    "user/fetchRecentReviews",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/doctor/dashboard/reviews/recent/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch recent reviews");
        }
    }
);

export const fetchDoctorProfile = createAsyncThunk(
    "user/fetchDoctorProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/doctor/dashboard/profile/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch doctor profile");
        }
    }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    patientProfile: null,
    doctorProfile: null,
    recentReviews: [],
    loading: false,
    error: null
  },
  reducers: {},
    extraReducers: (builder) => {
        builder
            // --- General Loading/Error Cases ---
            .addCase(fetchPatientProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRecentReviews.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDoctorProfile.pending, (state) => { state.loading = true; state.error = null; })

            .addCase(fetchPatientProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchRecentReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchDoctorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            // --- Fulfillment Cases ---

            .addCase(fetchPatientProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.patientProfile = action.payload;
            })
            
            .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.doctorProfile = action.payload;
            })

            .addCase(fetchRecentReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.recentReviews = action.payload;
            });
    }
});

export const {} = userSlice.actions;
export default userSlice.reducer;