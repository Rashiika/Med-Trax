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
            const response = await axiosInstance.get(`/doctor/dashboard/profile/complete/`);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to fetch doctor profile");
        }
    }
);

export const updatePatientProfile = createAsyncThunk(
    "user/updatePatientProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/patient/dashboard/profile/update/`, formData);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to update patient profile");
        }
    }
);

export const updateDoctorProfile = createAsyncThunk(
    "user/updateDoctorProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/doctor/dashboard/profile/update/`, formData);
            console.log(response)
            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data || "Failed to update doctor profile");
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
            .addCase(fetchPatientProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchRecentReviews.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchDoctorProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updatePatientProfile.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateDoctorProfile.pending, (state) => { state.loading = true; state.error = null; })

            .addCase(fetchPatientProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchRecentReviews.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchDoctorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(updatePatientProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(updateDoctorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

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
            })

            .addCase(updatePatientProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.patientProfile = action.payload;
            })

            .addCase(updateDoctorProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.doctorProfile = action.payload;
            });
    }
});

export const {} = userSlice.actions;
export default userSlice.reducer;