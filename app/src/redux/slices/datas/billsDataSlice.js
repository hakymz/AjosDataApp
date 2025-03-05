import {createSlice} from '@reduxjs/toolkit';
const initialState = {};

export const billsDataSlice = createSlice({
  name: 'billsData',
  initialState,
  reducers: {
    updateBillsData: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updateBillsData} = billsDataSlice.actions;

export default billsDataSlice.reducer;
