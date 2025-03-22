import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  updateUser,
  updateAppHasBeenOpened,
  updateLoggedIn,
  updateSettings,
  updateSessionOut,
  updateTour,
} from '../redux/slices';

import {fetchRequest} from '../helper';
import {SideDrawer} from '../view/components/sideDrawer';
import {BottomSheets} from '../view/components/general';
import Toast from '../view/components/toast/Toast';
// import Intercom from '@intercom/intercom-react-native';

export const useUser = location => {
  const dispatch = useDispatch();

  const {
    data,
    appHasBeenOpened,
    loggedIn,
    settings,
    sessionOut,
    showStepsPopup,
    tour,
  } = useSelector(state => state.userData);

  // clear the app save data also close any modal opened
  const clearAll = () => {
    BottomSheets.hide();
    SideDrawer.hide();
  };

  const autoLogout = async nextAppState => {
    let timeout = 60 * 50000;
    if (loggedIn == true) {
      if (nextAppState == 'background') {
        AsyncStorage.setItem(
          'sessionTimeOut',
          JSON.stringify(new Date()?.getTime()),
        );
        // console.log(sessionTimeOut.current);
      } else if (nextAppState == 'active' || nextAppState == 'check') {
        let sessionTimeOut = await AsyncStorage.getItem('sessionTimeOut');
        if (sessionTimeOut) {
          if (new Date()?.getTime() - sessionTimeOut >= timeout) {
            AsyncStorage.setItem('sessionTimeOut', '');
            logoutUser();
            Toast.show(
              'error',
              'You were automatically logged out due to inactivity on your account. Please re-login to continue.',
            );
          } else {
            AsyncStorage.setItem('sessionTimeOut', '');
          }
        }
      }
    }
  };

  const logoutUser = async () => {
    clearAll();

    setTimeout(() => {
      updateUserData({
        loggedIn: false,
        sessionOut: null,
      });
    }, 1000);
    // Intercom?.logout();
  };

  const deleteUser = async () => {
    const settings = {
      hideBalance: false,
      notification: true,
      biometrics: false,
    };
    await updateUserData({
      loggedIn: false,
      data: {},
      settings,
      sessionOut: null,
    });
    clearAll();
    // Intercom?.logout();
  };

  //dispatch data when user  open the app

  //Update user data, save data passed to the user device
  const updateUserData = async data => {
    try {
      //dispatch to store
      if (data.data != null) {
        dispatch(updateUser(data.data));
      }
      if (data.appHasBeenOpened != null) {
        dispatch(updateAppHasBeenOpened(data?.appHasBeenOpened));
      }
      if (data.tour != null) {
        dispatch(updateTour(data?.tour));
      }

      if (data.loggedIn != null) {
        dispatch(updateLoggedIn(data?.loggedIn));
      }

      if (data?.settings) {
        dispatch(updateSettings(data?.settings));
      }

      dispatch(updateSessionOut(data?.sessionOut));
    } catch (error) {
      console.log(error, 'errr');
    }
  };

  const getAndUpdateUserData = async () => {
    try {
      const response = await fetchRequest({
        path: 'settings/profile',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data && loggedIn) {
        updateUserData({
          data: {...data, user: {...data?.user, ...response?.data}},
        });
        return response;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getAndUpdateUserWallet = async () => {
    try {
      const response = await fetchRequest({
        path: 'wallet/balance',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data && loggedIn) {
        const newData = {...data, wallet: response?.data};
        updateUserData({data: newData});
        return response;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getUserImage = () => {
    if (data?.user?.avatar !== 'NULL' && data?.user?.avatar) {
      return {uri: data?.user?.avatar};
    }

    if (
      data?.user?.gender == 'male' ||
      data?.user?.gender == 'NULL' ||
      !data?.user?.gender
    ) {
      return require('../assets/images/avatars/boy1.png');
    } else {
      return require('../assets/images/avatars/girl1.png');
    }
  };

  return {
    data,
    user: data?.user,
    loggedIn,
    sessionOut,
    appHasBeenOpened,
    settings,
    showStepsPopup,
    tour,
    logoutUser,
    updateUserData,
    getAndUpdateUserData,
    getAndUpdateUserWallet,
    deleteUser,
    getUserImage,
    autoLogout,
  };
};
