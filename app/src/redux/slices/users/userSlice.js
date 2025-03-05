import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  loggedIn: false,
  data: null,
  appHasBeenOpened: false,
  sessionOut: false,
  settings: {},
  tour: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateAppHasBeenOpened: (state, action) => {
      state.appHasBeenOpened = action.payload;
    },
    updateTour: (state, action) => {
      state.tour = action.payload;
    },
    updateLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
    updateUser: (state, action) => {
      state.data = action.payload;
    },
    updateSessionOut: (state, action) => {
      state.sessionOut = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateUser,
  updateLoggedIn,
  updateSessionOut,
  updateAppHasBeenOpened,
  updateShowStepsPopup,
  updateSettings,
  updateTour,
} = userSlice.actions;

export default userSlice.reducer;
