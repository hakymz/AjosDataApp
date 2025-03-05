import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRequest} from '../helper';
import {updatePaymentData} from '../redux/slices';

export const usePayments = () => {
  const paymentData = useSelector(state => state.paymentData);
  const [state, setState] = React.useState(paymentData);
  const dispatch = useDispatch();
  const getAllCardsRef = React.useRef();
  const getAllBanksRef = React.useRef();
  const getMayBanksRef = React.useRef();

  React.useEffect(() => {
    dispatch(updatePaymentData(state));
  }, [state]);

  React.useEffect(() => {
    getAllBanks();
    return () => {
      clearTimeout(getAllCardsRef.current);
      clearTimeout(getAllBanksRef.current);
      clearTimeout(getMayBanksRef.current);
    };
  }, []);

  const getAllCards = async () => {
    clearTimeout(getAllCardsRef.current);
    try {
      const response = await fetchRequest({
        path: 'card',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        setState(prevState => ({...prevState, cards: response?.data}));
      } else {
        setState(prevState => ({...prevState, cards: []}));
      }
    } catch (error) {
      console.log(error);
      //send the request after some seconds
      getAllCardsRef.current = setTimeout(getAllCards, 10000);
    }
  };

  const getAllBanks = async () => {
    clearTimeout(getAllBanksRef.current);
    try {
      const response = await fetchRequest({
        path: 'bank/fetch',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data?.length > 0) {
        setState(prevState => ({...prevState, banks: response?.data}));
      }
    } catch (error) {
      //send the request after some seconds
      getAllBanksRef.current = setTimeout(getAllBanks, 10000);
    }
  };

  const getMyBanks = async () => {
    clearTimeout(getMayBanksRef.current);
    try {
      const response = await fetchRequest({
        path: 'bank/allbanks',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        setState(prevState => ({...prevState, myBanks: response?.data}));
      }
    } catch (error) {
      //send the request after some seconds
      getMayBanksRef.current = setTimeout(getMyBanks, 10000);
    }
  };

  return {
    getAllCards,
    getAllBanks,
    getMyBanks,
    ...paymentData,
  };
};
