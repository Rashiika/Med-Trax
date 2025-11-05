import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// --- Async Thunks (Keep these as they are correct) ---

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

// Assuming both accept/reject endpoints return the updated appointment object/data
export const acceptAppointmentRequest = createAsyncThunk(
    "appointment/acceptAppointmentRequest",
    async (requestId, { rejectWithValue }) => {
        try {
            // NOTE: Changed to PATCH as per standard API practices for updates
            const response = await axiosInstance.patch(`/appointments/doctor/${appointmentId}/accept/`);
            // Assuming response.data contains the updated appointment object
            return response.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to accept appointment request");
        }
    }
);

export const rejectAppointmentRequest = createAsyncThunk(
    "appointment/rejectAppointmentRequest",
    async (requestId, { rejectWithValue }) => {
        try {
            // NOTE: Changed to PATCH as per standard API practices for updates
            const response = await axiosInstance.patch(`/appointments/doctor/${appointmentId}/reject/`);
            // Assuming response.data contains the updated appointment object
            return response.data; 
        } catch (error) {
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

// --- Slice Definition ---

export const appointmentSlice = createSlice({
    name: "appointment",
    initialState: {
        patientStats: null, // Separated patient/doctor stats for clarity
        doctorStats: null,
        upcomingAppointments: [], // Patient's upcoming
        recentAppointments: [],   // Patient's recent
        doctorAppointments: [],   // Doctor's list of appointments
        requests: [],             // Doctor's incoming requests
        availableDoctors: [],
        doctorSlots: {},          // Could store slots keyed by doctorId
        loading: false,
        error: null,
        message: null, // For success messages like booking confirmation
    },
    reducers: {
        clearAppointmentMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // --- Patient Fullfilled Cases ---
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
            .addCase(fetchAvailableDoctors.fulfilled, (state, action) => {
                state.loading = false;
                state.availableDoctors = action.payload;
            })
            .addCase(bookAppointment.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message || "Appointment booked successfully!";
                // Optionally, add the new appointment to upcomingAppointments array
            })

            // --- Doctor Fullfilled Cases ---
            .addCase(fetchDoctorStats.fulfilled, (state, action) => {
                state.loading = false;
                state.doctorStats = action.payload;
            })
            .addCase(fetchDoctorConfirmedAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.doctorAppointments = action.payload;
            })
            // Re-using fetchPatientAppointments to update doctorAppointments if needed for a general list
            // .addCase(fetchDoctorAppointments.fulfilled, (state, action) => { ... }) 

            .addCase(fetchDoctorRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload;
            })
            .addCase(fetchDoctorSlots.fulfilled, (state, action) => {
                state.loading = false;
                // Assuming action.payload is the list of slots for the doctorId used in the thunk payload
                // You would typically store this in a map, or just store the result if needed temporarily.
                // state.doctorSlots = action.payload; 
            })
            
            // --- Request Management Cases ---
            .addCase(acceptAppointmentRequest.fulfilled, (state, action) => {
                state.loading = false;
                const acceptedAppointment = action.payload;
                
                // 1. Remove from requests list
                state.requests = state.requests.filter(req => req.id !== acceptedAppointment.id);
                
                // 2. Add to doctor's official appointments list (assuming status is now 'Accepted')
                state.doctorAppointments.push(acceptedAppointment);
                state.message = acceptedAppointment.message || "Request accepted.";
            })
            .addCase(rejectAppointmentRequest.fulfilled, (state, action) => {
                state.loading = false;
                const rejectedAppointment = action.payload;
                
                // 1. Remove from requests list
                state.requests = state.requests.filter(req => req.id !== rejectedAppointment.id);
                // No need to add to appointments list, as it's rejected
                state.message = rejectedAppointment.message || "Request rejected.";
            })

            .addMatcher(
                (action) => action.type.startsWith('appointment/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('appointment/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
    }
});

export const { clearAppointmentMessage } = appointmentSlice.actions;
export default appointmentSlice.reducer;