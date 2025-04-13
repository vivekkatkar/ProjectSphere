// redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  year : 0,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const { name, email, year } = action.payload;
      state.name = name;
      state.email = email;
      state.isLoggedIn = true;
    },
    clearUser(state) {
      state.name = '';
      state.email = '';
      state.year = 0;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
