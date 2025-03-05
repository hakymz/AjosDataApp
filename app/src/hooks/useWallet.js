import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRequest} from '../helper';
import {updateWalletData} from '../redux/slices';

export const useWallet = screen => {
  const walletData = useSelector(state => state.walletData);
  const [state, setState] = React.useState(walletData);
  const dispatch = useDispatch();
  const getWalletHistorysRef = React.useRef();
  const getWalletNotificationsRef = React.useRef();

  React.useEffect(() => {
    dispatch(updateWalletData(state));
  }, [state]);

  React.useEffect(() => {
    return () => {
      clearTimeout(getWalletNotificationsRef.current);
    };
  }, []);

  const updateFilter = filter => {
    setState(prevState => ({...prevState, filter}));
  };

  const getNotification = async () => {
    clearTimeout(getWalletNotificationsRef.current);
    try {
      const response = await fetchRequest({
        path: '/notification',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        setState(prevState => ({...prevState, notifications: response?.data}));
      }
    } catch (error) {
      //send the request after some seconds
      getWalletNotificationsRef.current = setTimeout(getNotification, 10000);
    }
  };
  return {
    updateFilter,
    getNotification,
    ...walletData,
  };
};
