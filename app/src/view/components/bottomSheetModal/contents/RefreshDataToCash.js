import React from 'react';
import {View, Keyboard} from 'react-native';
import {
  BottomSheets,
  Button,
  CheckBox,
  Input,
  PageInput,
  PagePicker,
  Text,
} from '../../general';

import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {COLORS} from '../../../../conts';
import {fetchRequest} from '../../../../helper';
import {useQuery, useQueryClient} from 'react-query';

const validationSchema = yup.object().shape({
  dataAmount: yup.object().required('Please choose amount'),
});

export const RefreshDataToCash = ({data}) => {
  const queryClient = useQueryClient();
  const refreshSim = async values => {
    console.log(values?.dataAmount?.value);

    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim/refresh/' + data?._id,
        data: {dataPlan: values?.dataAmount?.value},
      });

      BottomSheets.hide();
      queryClient.invalidateQueries({queryKey: ['getSimLinks']});
      console.log(response);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    setValues,
    submitForm,
    resetForm,
    isValid,
  } = useFormik({
    initialValues: {
      dataAmount: '',
      salesType: '',
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    onSubmit: values => {
      refreshSim(values);
    },
  });

  const getPlansConvertToCash = async values => {
    try {
      const response = await fetchRequest({
        path: 'billpayment/reseller/sim/data-identifier',
        method: 'GET',
        showLoader: false,
      });
      return response?.data?.map(item => ({name: item, value: item}));
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const {data: plans} = useQuery(
    'getPlansConvertToCash',
    getPlansConvertToCash,
  );

  return (
    <View style={{paddingHorizontal: 24, paddingBottom: 20}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Select Data plan
      </Text>
      <Text style={{marginTop: 20}} size={12} color={'#828282'}>
        You can select your data balance transfer tracking source to enable us
        track every detail correctly.
      </Text>

      <View style={{marginTop: 20}}>
        <PagePicker
          error={touched?.dataAmount && errors?.dataAmount}
          data={plans}
          value={values?.dataAmount}
          onValueChange={value => {
            setValues({...values, dataAmount: value});
          }}
          placeholder="Select Data Plan"
          onBlur={() => {
            setFieldTouched('dataAmount', true);
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 40}}>
          <Button
            onPress={() => {
              BottomSheets.hide();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: 122, marginRight: 10, paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            textColor={COLORS.white}
            type={isValid ? 'primary' : 'grey'}
            onPress={() => {
              Keyboard.dismiss();
              submitForm();
            }}
            fontSize={14}
            style={{width: 'auto', flex: 1, paddingHorizontal: 0}}
            title={'Continue'}
          />
        </View>
      </View>
    </View>
  );
};
