import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  visible: false,
  title: '',
  message: '',
  disableScrollIfPossible: true,
};

export const bottomSheetSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    updateBottomSheet: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updateBottomSheet} = bottomSheetSlice.actions;

export default bottomSheetSlice.reducer;
