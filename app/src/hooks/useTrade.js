import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRequest} from '../helper';
import {updateTradeData} from '../redux/slices';

export const useTradeData = () => {
  const tradeData = useSelector(state => state.tradeData);
  const [state, setState] = React.useState(tradeData);
  const dispatch = useDispatch();
  const getContextDataRef = React.useRef();
  const getGiftCardDataRef = React.useRef();
  const convertCurrencyRef = React.useRef();
  const getAllCountriesRef = React.useRef();
  const getGiftCardDataToBuyRef = React.useRef();
  const getAllGiftCardDataToBuyForAppleRef = React.useRef();
  const getAllRateAndFeesRef = React.useRef();

  React.useEffect(() => {
    dispatch(updateTradeData(state));
  }, [state]);

  React.useEffect(() => {
    getAllRateAndFees();

    return () => {
      clearTimeout(getContextDataRef.current);
      clearTimeout(getGiftCardDataRef.current);
      clearTimeout(convertCurrencyRef.current);
      clearTimeout(getAllCountriesRef.current);
      clearTimeout(getGiftCardDataToBuyRef.current);
      clearTimeout(getAllGiftCardDataToBuyForAppleRef.current);
      clearTimeout(getAllRateAndFeesRef.current);
    };
  }, []);

  const getAllGiftCardData = async () => {
    clearTimeout(getGiftCardDataRef.current);
    try {
      const response = await fetchRequest({
        path: 'crypto/get-gift-card',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.getCard?.length > 0
      ) {
        setState(prevState => ({
          ...prevState,
          giftCardsData: {
            rate: response?.data?.buyRate?.ratePerDollar,
            list: response?.data?.getCard,
          },
        }));
      }
    } catch (error) {
      console.log(error);
      //send the request after some seconds
      getGiftCardDataRef.current = setTimeout(getAllGiftCardData, 10000);
    }
  };

  const getAllGiftCardDataToBuy = async country => {
    clearTimeout(getGiftCardDataToBuyRef.current);
    setState(prevState => ({
      ...prevState,
      giftCardsDataToBuy: {list: null},
    }));
    if (country) {
      try {
        const response = await fetchRequest({
          path: 'crypto/product/countries?code=' + country,
          method: 'GET',
          displayMessage: false,
          showLoader: false,
        });

        console.log(response, 'yes .....');

        if (response?.status == 'success' && response?.data?.length > 0) {
          setState(prevState => ({
            ...prevState,
            giftCardsDataToBuy: {
              list: response?.data,
            },
          }));
        } else {
          setState(prevState => ({
            ...prevState,
            giftCardsDataToBuy: {list: []},
          }));
        }
      } catch (error) {
        //send the request after some seconds
        getGiftCardDataToBuyRef.current = setTimeout(
          getAllGiftCardDataToBuy,
          10000,
        );
      }
    }
  };

  const getAllGiftCardDataToBuyForApple = async () => {
    clearTimeout(getAllGiftCardDataToBuyForAppleRef.current);
    setState(prevState => ({
      ...prevState,
      giftCardsDataToBuy: {list: null},
    }));

    try {
      const response = await fetchRequest({
        path: 'crypto/apple/get-gift-card',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.getCard?.length > 0
      ) {
        // console.log(response?.data?.getCard);
        setState(prevState => ({
          ...prevState,
          giftCardsDataToBuy: {
            list: response?.data?.getCard,
          },
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          giftCardsDataToBuy: {list: []},
        }));
      }
    } catch (error) {
      //send the request after some seconds
      getAllGiftCardDataToBuyForAppleRef.current = setTimeout(
        getAllGiftCardDataToBuyForApple,
        10000,
      );
    }
  };

  const getAllCountries = async () => {
    clearTimeout(getAllCountriesRef.current);
    try {
      const response = await fetchRequest({
        path: 'crypto/all-countries',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        setState(prevState => ({
          ...prevState,
          countries: response.data,
        }));
      }
    } catch (error) {
      console.warn(error);
      //send the request after some seconds
      getAllCountriesRef.current = setTimeout(getAllCountries, 10000);
    }
  };

  const getAllRateAndFees = async () => {
    clearTimeout(getAllRateAndFeesRef.current);
    try {
      const response = await fetchRequest({
        path: 'rate/conversion-rate',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        setState(prevState => ({
          ...prevState,
          allRates: response?.data,
        }));
      }
    } catch (error) {
      console.warn(error);
      //send the request after some seconds
      getAllRateAndFeesRef.current = setTimeout(getAllRateAndFees, 10000);
    }
  };

  const convertCurrency = async (basecurrency, currency) => {
    setState(prevState => ({...prevState, convertedPrice: null}));
    clearTimeout(convertCurrencyRef.current);
    try {
      const response = await fetchRequest({
        path: `crypto/conversionrate?basecurrency=${basecurrency}&currency=${currency}`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data) {
        setState(prevState => ({...prevState, convertedPrice: response?.data}));
      }
    } catch (error) {
      console.log(error);
      //send the request after some seconds
      convertCurrencyRef.current = setTimeout(convertCurrency, 5000);
    }
  };

  return {
    getAllGiftCardDataToBuy,
    convertCurrency,
    getAllCountries,
    getAllGiftCardDataToBuyForApple,
    getAllRateAndFees,
    ...tradeData,
  };
};
