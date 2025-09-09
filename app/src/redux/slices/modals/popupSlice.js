import {createSlice} from '@reduxjs/toolkit';
const initialState = {visible: false, title: '', message: ''};

export const popupSlice = createSlice({
  name: 'popupModal',
  initialState,
  reducers: {
    updatePopupModal: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updatePopupModal} = popupSlice.actions;

export default popupSlice.reducer;
