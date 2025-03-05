import {createSlice} from '@reduxjs/toolkit';
const initialState = {visible: false, title: '', message: ''};

export const sideDrawerSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    updateDrawer: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updateDrawer} = sideDrawerSlice.actions;

export default sideDrawerSlice.reducer;
