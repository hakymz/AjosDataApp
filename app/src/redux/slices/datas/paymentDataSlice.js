import {createSlice} from '@reduxjs/toolkit';
const initialState = {};

export const paymentDataSlice = createSlice({
  name: 'paymentData',
  initialState,
  reducers: {
    updatePaymentData: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updatePaymentData} = paymentDataSlice.actions;

export default paymentDataSlice.reducer;
