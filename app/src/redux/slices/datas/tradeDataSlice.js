import {createSlice} from '@reduxjs/toolkit';
const initialState = {};

export const tradeDataSlice = createSlice({
  name: 'tradeData',
  initialState,
  reducers: {
    updateTradeData: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updateTradeData} = tradeDataSlice.actions;

export default tradeDataSlice.reducer;
