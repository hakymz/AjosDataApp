import {API, API_KEY, getToken} from '../../conts/api';

import {Preloader} from '../../view/components/loaders';
import axios from 'axios';
import qs from 'qs';

import Toast from '../../view/components/toast/Toast';
import {
  BottomSheets,
  TransactionStatusModal,
} from '../../view/components/bottomSheetModal';
import Store from '../../redux/store';
import {updateLoggedIn, updateSessionOut} from '../../redux/slices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openErrorScreen} from './openErrorScreen';

export const fetchRequest = async ({
  path,
  data = undefined,
  method = 'POST',
  showLoader = true,
  displayMessage = true,
  pageError = null,
  headers = null,
}) => {
  const token = await getToken();
  if (headers) {
    console.log(headers, 'headers headers headers');
  }

  if (token) {
    headers = {...headers, Authorization: `Bearer ${token}`};
  }

  const baseURL = API;

  const instance = axios.create({
    baseURL,
    responseType: 'json',
    headers: {...headers},
  });

  //Show the preloader by default
  if (showLoader) {
    Preloader.show();
  }

  try {
    let response;

    if (method == 'POST') {
      response = await instance.post(path, data);
    } else if (method == 'PUT') {
      response = await instance.put(path, data);
    } else if (method == 'PATCH') {
      response = await instance.patch(path, data);
    } else if (method == 'DELETE') {
      response = await instance.delete(path, data);
    } else {
      response = await instance.get(path);
    }

    return response?.data;
  } catch (error) {
    const {data: {message = ''} = {}, status} = error?.response || {};

    // console.error({url: path, message, status});

    if (status == 401) {
      Toast.show(
        'error',
        'You were automatically logged out due to inactivity on your account. Please re-login to continue.',
      );

      Store.dispatch(updateSessionOut(null));
      Store.dispatch(updateLoggedIn(false));
      BottomSheets.hide();
      AsyncStorage.setItem('sessionTimeOut', '');
    } else {
      if (pageError) {
        openErrorScreen({
          navigation: pageError?.navigation,
          title:
            pageError?.title ||
            message ||
            'We encountered some problems and we will love you to try again',
          subTitle: pageError?.message || message,
          proceed: pageError?.proceed,
          ...pageError,
        });
      } else {
        if (message) {
          displayMessage && Toast.show('error', message);
        } else {
          displayMessage && Toast.show('error', 'Something went wrong!');
        }
      }
      Preloader.hide();
    }

    throw error;
  } finally {
    if (showLoader) {
      Preloader.hide();
    }
  }
};
