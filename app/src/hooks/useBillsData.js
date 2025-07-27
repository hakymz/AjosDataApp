import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchRequest, openSuccessScreen} from '../helper';
import {updateBillsData} from '../redux/slices';
import {useNavigation} from '@react-navigation/native';
import Toast from '../view/components/toast/Toast';

export const useBillsData = () => {
  const billsData = useSelector(state => state.billsData);
  const [state, setState] = React.useState(billsData);
  const dispatch = useDispatch();
  const getVariationCodeIdRef = React.useRef();
  const navigation = useNavigation();

  React.useEffect(() => {
    dispatch(updateBillsData(state));
  }, [state]);

  React.useEffect(() => {}, []);

  const getAirtimeData = async () => {
    try {
      const response = await fetchRequest({
        path: '/billpayment/airtime/networks',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      return response?.data;
    } catch (error) {
      throw error;
    }
  };

  const getDataBundleData = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/service-id?identifier=data',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.content?.length > 0
      ) {
        return response?.data?.content;
      }
    } catch (error) {
      throw error;
    }
  };

  const getCustomers = async () => {
    try {
      const response = await fetchRequest({
        path: '/customer?page=1&limit=10',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response?.status == 'success') {
        return response?.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const addCustomers = async values => {
    try {
      const response = await fetchRequest({
        path: 'customer',
        method: 'POST',
        data: {...values},
      });
      console.log(response);

      openSuccessScreen({
        navigation,
        title: 'Customer successfully saved, Well done!',
        proceed: () => navigation.navigate('HomeScreen'),
        btnTitle: 'Go Home',
      });
    } catch (error) {
      console.log(error, 'erooor');
      throw error;
    }
  };

  const deleteCustomers = async id => {
    try {
      const response = await fetchRequest({
        path: 'customer/delete/' + id,
        method: 'DELETE',
      });

      if (response?.status == 'success') {
        Toast.show('success', 'Customer deleted');
      }

      return response;
    } catch (error) {
      console.log(error, 'erooor');
      throw error;
    }
  };

  const getTvData = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/service-id?identifier=tv-subscription',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      console.log(response, 'tv data responseee....');

      if (
        response?.status == 'success' &&
        response?.data?.content?.length > 0
      ) {
        return response?.data?.content;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getEducationData = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/service-id?identifier=education',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.content?.length > 0
      ) {
        return response?.data?.content;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getElectricityData = async () => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/service-id?identifier=electricity-bill',
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (
        response?.status == 'success' &&
        response?.data?.content?.length > 0
      ) {
        return response?.data?.content;
      }
    } catch (error) {
      throw error;
    }
  };

  const getVariationCodeById = async (id, variationCodesType) => {
    setState(prevState => ({...prevState, variationCodes: []}));
    clearTimeout(getVariationCodeIdRef.current);
    try {
      const response = await fetchRequest({
        path: 'billpayment/vtpass/variation-code?serviceId=' + id,
        method: 'GET',
        // displayMessage: false,
        showLoader: false,
      });

      console.log(response, id);
      if (
        response?.status == 'success' &&
        response?.data?.content?.varations?.length > 0
      ) {
        const filteredData = response?.data?.content?.varations?.map?.(
          item => ({
            value: item?.variation_code,
            ...item,
          }),
        );

        setState(prevState => ({
          ...prevState,
          [variationCodesType]: {
            fee: response?.data?.content?.convinience_fee,
            ...response?.data,
            variations: filteredData,
          },
        }));
      }
    } catch (error) {
      console.log(error);
      //send the request after some seconds
      getVariationCodeIdRef.current = setTimeout(getVariationCodeById, 10000);
    }
  };

  return {
    getVariationCodeById,
    getAirtimeData,
    getDataBundleData,
    getTvData,
    getElectricityData,
    getCustomers,
    deleteCustomers,
    addCustomers,
    getEducationData,
    ...billsData,
  };
};
