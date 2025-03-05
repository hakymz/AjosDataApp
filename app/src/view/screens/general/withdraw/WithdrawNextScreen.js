import {useFormik} from 'formik';
import React from 'react';
import {
  BottomSheets,
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  MyIcons,
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
  useWindowDimensions,
} from 'react-native';
import {Banks} from '../../../components/bottomSheetModal/content';
import {useQuery} from 'react-query';
import {s} from 'react-native-size-matters';
import {fetchRequest} from '../../../../helper';
import {Image} from '../../../components/general/image';

const validationSchema = yup.object().shape({
  bank: yup.object().required('Please choose bank'),
  accountName: yup.string().required('Please input beneficiary name'),
  accountNo: yup.number().required('Please input account no'),
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

const BankIcon = ({item, values, setValues}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setValues({
          ...values,
          accountName: item?.name,
          accountNo: item?.accountNumber,
          bank: {
            code: item?.bankCode,
            bankId: item?.bankId,
            name: item?.bankName,
            logo: item?.avatar,
          },
        });
      }}
      style={{width: s(80), alignItems: 'center', marginRight: 10}}>
      <View style={style.bankIcon}>
        <Image source={{uri: item?.avatar}} style={{height: 27, width: 27}} />
      </View>
      <Text
        textAlign={'center'}
        style={{marginTop: 10}}
        numberOfLines={1}
        size={12}
        semiBold>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};

const RecentBeneficiaries = ({setValues, values}) => {
  const getFrequentTransferUsers = async () => {
    try {
      const response = await fetchRequest({
        path: `wallet/beneficiaries?type=bank`,
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

      {data?.length == 0 ? (
        <View>
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
      ) : (
        <View>
          <View>
            <Text semiBold color={COLORS.dark}>
              Recent Beneficiaries
            </Text>
            <ScrollView contentContainerStyle={{marginTop: 20}}>
              {data?.map(item => (
                <BankIcon item={item} setValues={setValues} values={values} />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

const validateBank = async (values, setValues, setLoadingAccountName) => {
  const accountNumber = values.accountNo;
  const bank = values?.bank;
  if (accountNumber.length > 9) {
    setValues({
      ...values,
    });
    setLoadingAccountName(true);
    try {
      const response = await fetchRequest({
        path: `bank/validate`,
        data: {bankCode: values?.bank.code, accountNumber: values?.accountNo},
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

export const WithdrawNextScreen = ({navigation, route}) => {
  const {amount, title} = route?.params || {};
  const [loadingAccountName, setLoadingAccountName] = React.useState(false);
  const {height} = useWindowDimensions();

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
      amount: '',
      bank: '',
      accountNo: __DEV__ ? '0112748464' : '',
      save: false,
      accountName: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      navigation.navigate('WithdrawSummaryScreen', {...values, amount});
    },
  });

  return (
    <CustomSafeAreaView>
      <AppNav title={title || 'Withdraw'} line />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 40,
          minHeight: minHeight - 80,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        }}>
        <View style={{paddingHorizontal: 20}}>
          <TouchableOpacity
            onPress={() => {
              BottomSheets.show({
                component: (
                  <Banks
                    onChange={value => {
                      setFieldValue('bank', value);
                    }}
                  />
                ),
                scrollview: false,
                customSnapPoints: ['75%', '75%'],
              });
            }}>
            <View
              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: 1,
              }}></View>
            <Input
              error={errors?.bank}
              value={values?.bank?.name}
              editable={false}
              backgroundColor={COLORS.background}
              textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
              fontFamily={FONTS.EINA04_FONTS.semiBold}
              placeholder="Select Bank"
              rightIcon={
                <MyIcons.ArrowGreen
                  size={16}
                  style={{left: -15, transform: [{rotate: '90deg'}]}}
                />
              }
            />
          </TouchableOpacity>

          <Input
            error={touched?.accountNo && errors?.accountNo}
            value={values?.accountNo}
            backgroundColor={COLORS.background}
            textColor={{active: COLORS.black, blur: COLORS.inputGrey}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
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
          />

          <Input
            loading={loadingAccountName}
            editable={false}
            error={touched?.accountName && errors?.accountName}
            value={values?.accountName}
            backgroundColor={COLORS.black}
            textColor={{active: COLORS.yellow, blur: COLORS.yellow}}
            fontFamily={FONTS.EINA04_FONTS.semiBold}
            onChangeText={value => {
              setFieldValue('accountName', value);
            }}
            onBlur={() => setFieldTouched('accountName', true)}
            placeholder="Beneficiary Name"
          />
        </View>
        <SaveBeneficiary
          save={values?.save}
          onChange={() => {
            console.log('Yess');
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
            disabled={!values?.accountName && !values.accountNo && !values.bank}
            textColor={'white'}
            type={
              values?.accountName && values.accountNo && values.bank
                ? 'black'
                : 'grey'
            }
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
