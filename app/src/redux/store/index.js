import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import userReducer from '../slices/users/userSlice';
import layoutsReducer from '../slices/layouts/layoutsSlice';
import alertReducer from '../slices/modals/sideDrawerSlice';
import toastReducer from '../slices/modals/toastSlice';
import loaderReducer from '../slices/modals/loaderSlice';
import sideDrawerReducer from '../slices/modals/sideDrawerSlice';
import bottomSheetReducer from '../slices/modals/bottomSheetSlice';
import tradeReducer from '../slices/datas/tradeDataSlice';
import billsReducer from '../slices/datas/billsDataSlice';
import paymentReducer from '../slices/datas/paymentDataSlice';
import walletReducer from '../slices/datas/walletDataSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const reducers = combineReducers({
  userData: userReducer,
  alert: alertReducer,
  loader: loaderReducer,
  bottomSheet: bottomSheetReducer,
  sideDrawer: sideDrawerReducer,
  layouts: layoutsReducer,
  toast: toastReducer,
  tradeData: tradeReducer,
  billsData: billsReducer,
  paymentData: paymentReducer,
  walletData: walletReducer,
});

// middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     })

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userData'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
});

export default store;
