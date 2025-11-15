import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const fetchDoctorPatients = createAsyncThunk(
  "prescription/fetchDoctorPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/prescription/doctor/patients/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch patients");
    }
  }
);

export const createPrescription = createAsyncThunk(
  "prescription/createPrescription",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/prescription/doctor/create/`, payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create prescription");
    }
  }
);

export const fetchDoctorPrescriptions = createAsyncThunk(
  "prescription/fetchDoctorPrescriptions",
  async (patientId = null, { rejectWithValue }) => {
    try {
      const endpoint = patientId
        ? `/prescription/doctor/list/?patient_id=${patientId}`
        : `/prescription/doctor/list/`;

      const res = await axiosInstance.get(endpoint);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch prescriptions");
    }
  }
);

export const fetchPatientPrescriptions = createAsyncThunk(
  "prescription/fetchPatientPrescriptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/prescription/patient/list/`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch prescriptions");
    }
  }
);

export const fetchPrescriptionsByDoctor = createAsyncThunk(
  "prescription/fetchPrescriptionsByDoctor",
  async (doctorId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `/prescription/patient/doctor/${doctorId}/`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch doctor prescriptions");
    }
  }
);

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState: {
    doctorPatients: [],
    doctorPrescriptions: [],
    patientPrescriptions: [],
    prescriptionsByDoctor: [],
    createdPrescription: null,

    loading: false,
    error: null,
  },

  reducers: {
    clearCreatedPrescription: (state) => {
      state.createdPrescription = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorPatients = action.payload;
      })

      /* -------------------------- create prescription --------------------------- */
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.createdPrescription = action.payload.prescription;
      })

      /* -------------------------- doctor prescriptions -------------------------- */
      .addCase(fetchDoctorPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorPrescriptions = action.payload;
      })

      /* -------------------------- patient prescriptions ------------------------- */
      .addCase(fetchPatientPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.patientPrescriptions = action.payload;
      })

      /* ------------------ patient → prescriptions by doctor --------------------- */
      .addCase(fetchPrescriptionsByDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptionsByDoctor = action.payload;
      })

      /* ----------------------------- Pending State ------------------------------ */
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      /* ----------------------------- Rejected State ----------------------------- */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearCreatedPrescription } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;
