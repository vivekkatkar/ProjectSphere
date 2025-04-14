import { createSlice } from "@reduxjs/toolkit";

const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

const initialState = savedUser || {
  name: "",
  email: "",
  prn: "",
  year: 0,
  phone: "",
  semester: 0,
  teamId: null,
  batchId: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { name, email, prn, year, phone, semester, teamId, batchId } = action.payload;

      state.name = name;
      state.email = email;
      state.prn = prn;
      state.year = year;
      state.phone = phone;
      state.semester = semester;
      state.teamId = teamId;
      state.batchId = batchId;

      localStorage.setItem("user", JSON.stringify(state));
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
      state.prn = "";
      state.year = 0;
      state.phone = "";
      state.semester = 0;
      state.teamId = null;
      state.batchId = 0;

      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
