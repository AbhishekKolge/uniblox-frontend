import { createSlice } from '@reduxjs/toolkit';

const initialAuthState = {
  accessExpirationTime: null,
  isLoggedIn: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      const { accessExpirationTime, userId } = action.payload;
      state.accessExpirationTime = accessExpirationTime;
      state.userId = userId;
      state.isLoggedIn = true;
    },
    logout(state) {
      state.accessExpirationTime = initialAuthState.accessExpirationTime;
      state.isLoggedIn = false;
      state.userId = initialAuthState.userId;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
