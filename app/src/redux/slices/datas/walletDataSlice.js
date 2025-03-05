import {createSlice} from '@reduxjs/toolkit';
const initialState = {};

export const walletDataSlice = createSlice({
  name: 'walletData',
  initialState,
  reducers: {
    updateWalletData: (state, action) => (state = action.payload),
  },
});

// Action creators are generated for each case reducer function
export const {updateWalletData} = walletDataSlice.actions;

export default walletDataSlice.reducer;
