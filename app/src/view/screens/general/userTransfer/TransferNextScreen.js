import {useFormik} from 'formik';
import React from 'react';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Switch,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import * as yup from 'yup';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {useLayouts} from '../../../../hooks';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from 'react-query';
import {s} from 'react-native-size-matters';
import {fetchRequest} from '../../../../helper';

const validationSchema = yup.object().shape({
  fullname: yup.string().required('Please input fullname'),
  username: yup.string().required('Please input username'),
});

const SaveBeneficiary = ({save, onChange}) => {
  return (
    <View style={style.saveBeneficiaryInput}>
      <Text semiBold color={save ? COLORS.primary : COLORS.inputGrey}>
        Save as Beneficiary
      </Text>
      <Switch enabled={save} onPress={onChange} />
    </View>
  );
};

const UserIcon = ({item, values, setValues}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setValues({
          ...values,
          username: item?.username,
          fullname: item?.name,
        });
      }}
      style={{width: s(80), alignItems: 'center', marginRight: 10}}>
      <View style={style.bankIcon}>
        <Text size={20} bold>
          {item?.username?.split?.('')[0]}
        </Text>
      </View>
      <Text
        textAlign={'center'}
        style={{marginTop: 10}}
        numberOfLines={1}
        size={12}
        semiBold>
        {item?.username}
      </Text>
    </TouchableOpacity>
  );
};

const RecentBeneficiaries = ({setValues, values}) => {
  const getFrequentTransferUsers = async () => {
    try {
      const response = await fetchRequest({
        path: `wallet/beneficiaries?type=snapi`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      if (response.status == 'success' && response?.data) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const {data, loading} = useQuery(
    'getFrequentTransferUsers',
    getFrequentTransferUsers,
  );

  return (
    <View style={{marginTop: 30}}>
      {loading && (
        <View>
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        </View>
      )}

      {data?.length == 0 && (
        <View style={{marginTop: 20}}>
          <Text semiBold textAlign={'center'}>
            No Saved Beneficiaries Yet
          </Text>
          <Text
            size={12}
            style={{marginTop: 10}}
            color={COLORS.inputGrey}
            textAlign={'center'}>
            Your saved beneficiaries would appear here once they are saved,
            against your next withdrawal
          </Text>
        </View>
      )}

      {data?.length > 0 && (
        <View>
          <View>
            <Text semiBold color={COLORS.dark}>
              Recent Beneficiaries
            </Text>
            <ScrollView contentContainerStyle={{marginTop: 20}}>
              {data?.map(item => (
                <UserIcon item={item} setValues={setValues} values={values} />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const validateUser = async (values, setValues) => {
  const username = values?.username;
  if (username.length > 2) {
    setValues({
      ...values,
      fullname: '',
    });

    try {
      const response = await fetchRequest({
        path: `profile/verify-username`,
        data: {userTag: values?.username?.toString?.()},
        showLoader: false,
      });

      if (response?.status == 'success' && response?.data?.firstName) {
        setValues({
          ...values,
          fullname: `${response?.data?.firstName} ${response?.data?.lastName}`,
        });
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    setValues({
      ...values,
      fullname: '',
    });
  }
};

export const TransferNextScreen = ({navigation, route}) => {
  const {amount} = route?.params || {};

  const {minHeight} = useLayouts();
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    setValues,
    isValid,
  } = useFormik({
    initialValues: {
      username: __DEV__ ? '' : '',
      save: false,
      fullname: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      navigation.navigate('TransferSummaryScreen', {...values, amount});
    },
  });

  return (
    <CustomSafeAreaView>
      <AppNav title={'User - User transfer'} line />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          minHeight: minHeight - 80,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <Input
            leftIcon={
              <Text semiBold color={'#969696'}>
                @ -{' '}
              </Text>
            }
            error={touched?.username && errors?.username}
            value={values?.username}
            backgroundColor={COLORS.background}
            textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            onChangeText={value => {
              // setFieldValue('accountNo', value);
              validateUser({...values, username: value}, setValues);
            }}
            onBlur={() => setFieldTouched('username', true)}
            placeholder="Username"
          />

          <Input
            editable={false}
            error={touched?.fullname && errors?.fullname}
            value={values?.fullname}
            backgroundColor={COLORS.black}
            textColor={{active: COLORS.yellow, blur: COLORS.yellow}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            onChangeText={value => {
              setFieldValue('fullname', value);
            }}
            onBlur={() => setFieldTouched('fullname', true)}
            placeholder="User Fullname"
          />
        </View>
        <SaveBeneficiary
          save={values?.save}
          onChange={() => {
            setFieldValue('save', !values?.save);
          }}
        />

        <RecentBeneficiaries setValues={setValues} values={values} />
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: 40,
            paddingHorizontal: 30,
          }}>
          <Button
            disabled={!values?.username && !values.fullname}
            textColor={'white'}
            type={values?.username && values.fullname ? 'black' : 'grey'}
            onPress={() => {
              handleSubmit();
            }}
            title="Continue"
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};

const style = StyleSheet.create({
  saveBeneficiaryInput: {
    height: s(55),
    backgroundColor: '#F1F1F1',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  bankIcon: {
    height: s(50),
    width: s(50),
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.background,
  },
});
