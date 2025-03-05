import React from 'react';
import {COLORS, GENERAL} from '../conts';
import {useSelector, useDispatch} from 'react-redux';

import {useUser} from '.';
import {updateTheme} from '../redux/slices';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTheme = () => {
  const {updateUserData} = useUser();
  const dispatch = useDispatch();
  const {theme} = useSelector(state => state.theme);

  const setTheme = async theme => {
    if (theme == 'savedTheme') {
      try {
        let savedTheme = await AsyncStorage.getItem('userData');
        if (savedTheme) {
          savedTheme = JSON.parse(savedTheme)?.theme;
          dispatch(updateTheme(savedTheme || GENERAL.LightTheme));
          updateUserData({theme: savedTheme || GENERAL.LightTheme});
        }
      } catch (error) {}
    } else {
      dispatch(updateTheme(theme));
      updateUserData({theme});
    }
  };

  return {colors: COLORS, theme, setTheme};
};
