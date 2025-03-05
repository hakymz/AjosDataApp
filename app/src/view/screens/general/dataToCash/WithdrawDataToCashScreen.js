import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Input,
  PageInput,
  PagePicker,
  Text,
} from '../../../components/general';
import {AppNav} from '../../../components/layouts';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useLayouts, useUser} from '../../../../hooks';
import {AccountBalance} from '../../../components/dataToCash';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {COLORS, IMAGES} from '../../../../conts';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';
import {
  ConvertDataToCashSelectBank,
  ConvertDataToCashSelectCountry,
  WithdrawDataToCashSummary,
} from '../../../components/bottomSheetModal/contents';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PageList} from '../../../components/lists';

const validationSchema = yup.object().shape({
  bank: yup.object().required('Please choose bank'),
  accountName: yup.string().required('Please input account name'),
  accountNo: yup.number().required('Please input account no'),
});

const validateBank = async (values, setValues, setLoadingAccountName) => {
  const accountNumber = values.accountNo;
  if (accountNumber.length > 9) {
    setValues({
      ...values,
    });
    setLoadingAccountName(true);
    try {
      const response = await fetchRequest({
        path: `wallet/validate-bank?accountNumber=${values?.accountNo}&bankCode=${values?.bank.code}`,
        method: 'GET',
        showLoader: false,
      });

      if (response.status == 'success' && response?.data) {
        setValues({
          ...values,
          accountName: response?.data?.accountName,
        });
      } else {
        setValues({
          ...values,
          accountName: '',
        });
      }
    } catch (error) {
      console.log(error, 'errrr');
    } finally {
      setLoadingAccountName(false);
    }
  } else {
    setValues({
      ...values,
      accountName: '',
    });
    setLoadingAccountName(false);
  }
};

export const WithdrawDataToCashScreen = ({navigation, route}) => {
  const {
    data: {user = {}},
  } = useUser();

  const {amount} = route?.params || {};
  const [balance, setBalance] = React.useState(0);

  const {minHeight} = useLayouts();

  const [loadingAccountName, setLoadingAccountName] = React.useState(false);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    setValues,
    isValid,
    handleChange,
    handleBlur,
    submitForm,
  } = useFormik({
    initialValues: {
      bank: '',
      accountNo: __DEV__ ? '0112748464' : '',
      accountName: '',
    },
    validationSchema: validationSchema,
    validateOnMount: true,
    onSubmit: values => {
      BottomSheets.show({
        component: (
          <WithdrawDataToCashSummary data={{...values, amount, balance}} />
        ),
      });
    },
  });

  return (
    <CustomSafeAreaView>
      <AppNav
        line
        comp={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
            }}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text size={18} fontWeight={'800'}>
                MTN Data - Cash
              </Text>
            </View>

            <Image
              style={{height: 34, width: 34}}
              source={require('../../../../assets/images/others/mtn.png')}
            />
          </View>
        }
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 40,
          paddingHorizontal: 20,
          minHeight: minHeight - 70,
        }}>
        <AccountBalance setBalance={setBalance} />

        <View style={{marginTop: 40}}>
          <Text style={{marginBottom: 20}} size={18} bd>
            Add Bank
          </Text>
          <TouchableOpacity
            onPress={() => {
              BottomSheets.show({
                component: (
                  <ConvertDataToCashSelectBank
                    onChange={value => {
                      console.log(value);
                      setFieldValue('bank', value);
                    }}
                  />
                ),
                customSnapPoints: ['80%', '80%'],
              });
            }}>
            <PageList
              style={{
                borderColor:
                  errors?.bank && touched?.bank ? COLORS.error : '#EAECF0',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{marginRight: 20, flex: 1}}
                  numberOfLines={1}
                  size={18}
                  md
                  color={
                    errors?.bank && touched?.bank ? COLORS.error : COLORS.blue
                  }>
                  {errors?.bank && touched?.bank
                    ? 'Select Bank'
                    : values?.bank?.name || 'Select Bank'}
                </Text>

                <View
                  style={{
                    height: 36,
                    width: 36,
                    borderWidth: 1,
                    borderColor: '#EAECF0',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image source={IMAGES.chevron} />
                </View>
              </View>
            </PageList>
          </TouchableOpacity>

          <PageInput
            error={touched?.accountNo && errors?.accountNo}
            value={values?.accountNo}
            onChangeText={value => {
              // setFieldValue('accountNo', value);
              validateBank(
                {...values, accountNo: value},
                setValues,
                setLoadingAccountName,
              );
            }}
            onBlur={() => setFieldTouched('accountNo', true)}
            placeholder="Account Number"
            rightIcon={
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text fontWeight={'500'} color={'#9A9A9A'} size={12}>
                  Account Number
                </Text>
              </View>
            }
          />

          <Text
            fontWeight={'500'}
            color={COLORS.dark}
            size={14}
            style={{
              marginTop: 20,
              marginBottom: 10,
              paddingHorizontal: 10,
            }}>
            Bank Account Name
          </Text>
          <Input
            editable={false}
            keyboardType="numeric"
            value={values.accountName}
            error={touched?.accountName && errors?.accountName}
            onChangeText={handleChange('accountName')}
            onBlur={() => setFieldTouched('accountName', true)}
            textColor={COLORS.blue}
            placeholder={loadingAccountName ? 'Loading...' : 'Account Name'}
            backgroundColor="#EFF1FB"
          />
          {loadingAccountName && (
            <View>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            fontSize={14}
            type="lightGrey"
            style={{width: '48%', paddingHorizontal: 0}}
            title={'Cancel'}
          />
          <Button
            titleStyle={{color: COLORS.white}}
            type={isValid ? 'primary' : 'grey'}
            onPress={() => {
              Keyboard.dismiss();
              submitForm();
            }}
            fontSize={14}
            style={{width: '48%', paddingHorizontal: 0}}
            title={'Continue'}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({});
