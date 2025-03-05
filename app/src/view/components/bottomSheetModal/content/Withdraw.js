import React from 'react';
import {View, Image, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import {BigInput, Button, DisplayAmount, Icons, Text} from '../../general';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {useLayouts, usePayments, useUser, useWallet} from '../../../../hooks';
import {BottomSheets} from '../BottomSheets';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {selectNGNWallet} from '../../../../selectors.js/index.js';
import {fetchRequest, formatAmount} from '../../../../helper';
import {Formik} from 'formik';
import * as yup from 'yup';
import Toast from '../../toast/Toast';
import LottieView from 'lottie-react-native';
import {TransactionStatusModal} from '../TransactionStatusModal';
import {useNavigation} from '@react-navigation/native';
import CurrencyInput from 'react-native-currency-input';

const List = ({item, index, selectedAccount, setSelectedAccount}) => {
  return (
    <TouchableOpacity
      onPress={() => setSelectedAccount(index)}
      activeOpacity={0.7}
      style={{
        height: s(95),
        backgroundColor: index == selectedAccount ? COLORS.white : '#F7F7F9',
        marginBottom: 10,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          height: s(53),
          width: s(53),
          borderColor: '#DCE1FA',
          borderWidth: 2,
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <Image
          source={{uri: item?.logo}}
          style={{height: s(27), width: s(27), resizeMode: 'contain'}}
        />
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text
          numberOfLines={1}
          medium
          color={COLORS.primary}
          style={{opacity: index == selectedAccount ? 1 : 0.3, width: '90%'}}>
          {item.accountName}
        </Text>
        <Text
          color={COLORS.lightBlue}
          style={{
            textAlign: 'right',
            opacity: index == selectedAccount ? 1 : 0.3,
          }}>
          {item.accountNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const AmountCard = ({
  value,
  error,
  onFocus = () => {},
  onBlur = () => {},
  onChangeText = () => {},
  ...inputProps
}) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <View
      style={{
        height: s(90),
        backgroundColor: error && !focused ? '#FFF5F6' : COLORS.white,
        marginBottom: 10,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
        justifyContent: 'space-between',
        flex: 1,
        borderWidth: 1,
        borderColor: error && !focused ? COLORS.red : COLORS.white,
      }}>
      <Text style={{flex: 0.4}} color={'#727272'}>
        Amount
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          flex: 0.6,
        }}>
        <View
          style={{top: GENERAL.platform == 'ios' ? 10 : s(17), marginRight: 2}}>
          <Icons.Naira color={COLORS.voodoo} height={31} width={16} />
        </View>
        <CurrencyInput
          placeholderTextColor={COLORS.voodoo}
          value={value}
          onChangeValue={value => {
            onChangeText(value);
          }}
          delimiter=","
          separator="."
          precision={2}
          onFocus={() => {
            onFocus();
            setFocused(true);
          }}
          onBlur={() => {
            onBlur();
            setFocused(false);
          }}
          style={{
            fontSize: s(30),
            color: COLORS.voodoo,
            fontFamily: FONTS.FREDOKA_FONTS.regular,
            textAlign: 'right',
            paddingHorizontal: 0,
          }}
          {...inputProps}
        />
      </View>
    </View>
  );
};

const SelectedBankAccountCard = ({item}) => {
  return (
    <View
      style={{
        height: s(55),
        backgroundColor: '#F7F7F9',
        borderRadius: 60,
        marginHorizontal: 20,
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
      }}>
      <Image style={{height: s(27), width: s(27)}} source={{uri: item?.logo}} />
      <View style={{alignItems: 'flex-end', flex: 1}}>
        <Text
          numberOfLines={1}
          medium
          color={COLORS.primary}
          style={{opacity: 0.3, width: '70%'}}>
          {item?.accountName}
        </Text>
        <Text
          color={COLORS.lightBlue}
          style={{
            textAlign: 'right',
            opacity: 0.3,
          }}>
          {item?.accountNumber}
        </Text>
      </View>
    </View>
  );
};
export const Withdraw = () => {
  const {data} = useUser();
  const {myBanks} = usePayments();
  const [selectedAccount, setSelectedAccount] = React.useState(0);
  const [state, setState] = React.useState({amount: 0});
  const [currentPage, setCurrentPage] = React.useState(0);
  const formikRef = React.useRef();
  const navigation = useNavigation();
  const {getWalletHistory} = useWallet();

  const continueBtn = async () => {
    if (currentPage == 0) {
      setCurrentPage(1);
    } else if (currentPage == 1) {
      Keyboard.dismiss();
      await formikRef?.current?.submitForm();
      if (formikRef?.current?.errors?.amount) {
        Toast.show('error', formikRef?.current?.errors?.amount);
      } else {
        const pinScreenDetails = {
          image: myBanks[selectedAccount].logo,
          name: myBanks[selectedAccount]?.accountName || null,
          message: 'You are Sending',
          amount: state?.amount,
          fee: '8.50',
          details: `${myBanks[selectedAccount].accountNumber} - ${myBanks[selectedAccount].bankName}`,
        };
        BottomSheets.hide();
        navigation.navigate('PinScreen', {
          details: pinScreenDetails,
          method: pin => withdrawToBank(pin),
        });
      }
    }
  };

  const withdrawToBank = async transactionPin => {
    try {
      const response = await fetchRequest({
        path: 'wallets/withdrawal',
        data: {
          amount: state?.amount,
          transactionPin,
          bankId: myBanks[selectedAccount]?._id,
        },
      });
      if (
        response.status == 'success' &&
        response?.data?.mywallet?.length > 0
      ) {
        getWalletHistory();
        BottomSheets.show({
          customSnapPoints: [500, 500],
          backgroundColor: COLORS.white,
          component: (
            <View style={{height: '100%'}}>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50, minHeight: '100%'}}>
                <View style={{marginTop: 20, alignItems: 'center', flex: 1}}>
                  <View style={{height: s(250), justifyContent: 'center'}}>
                    <LottieView
                      resizeMode="cover"
                      style={{
                        height: s(239),
                        width: s(239),
                      }}
                      autoPlay
                      loop
                      source={require('../../../../assets/lottieFiles/others/pig.json')}
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                      marginTop: 20,
                    }}>
                    <Text
                      color={COLORS.lightBlue}
                      fontType={FONTS.FREDOKA}
                      lineHeight={21}
                      size={18}
                      textAlign="center"
                      style={{paddingHorizontal: 50}}>
                      Withdraw Successful
                    </Text>
                  </View>
                </View>
              </BottomSheetScrollView>
            </View>
          ),
        });
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {}
  };

  const validationSchema = yup.object().shape({
    amount: yup
      .string()
      .required('Please input amount')
      .test('anount', 'Min amount of 1000NGN', value => {
        const formatedAmount = value;
        return formatedAmount >= 10;
      })

      .test('account-balance', 'More than Wallet Ballance', value => {
        const formatedAmount = value;
        return formatedAmount < selectNGNWallet(data)?.amount;
      }),
  });

  return (
    <View style={{height: '100%'}}>
      <View style={{paddingBottom: 10}}>
        <Text
          fontType={FONTS.FREDOKA_FONTS}
          color={COLORS.lightBlue}
          size={18}
          style={{textAlign: 'center'}}>
          Withdraw
        </Text>
        <Text
          color={'#727272'}
          size={14}
          style={{textAlign: 'center', paddingTop: 30, paddingHorizontal: 20}}>
          You can only withdraw to one of your saved bank account
        </Text>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40, minHeight: '95%'}}>
        <View style={{marginTop: 20}}>
          <View></View>
          {currentPage == 0 ? (
            myBanks?.map((item, index) => (
              <List
                item={item}
                index={index}
                selectedAccount={selectedAccount}
                setSelectedAccount={setSelectedAccount}
              />
            ))
          ) : (
            <View style={{flex: 1}}>
              <Formik
                innerRef={formikRef}
                initialValues={{
                  amount: 0.0,
                }}
                validationSchema={validationSchema}
                onSubmit={values => {}}>
                {({
                  values,
                  errors,
                  handleChange,
                  handleSubmit,
                  touched,
                  setFieldTouched,
                  setFieldValue,
                  setFieldError,
                  setValues,
                  status,
                }) => (
                  <AmountCard
                    value={values.amount}
                    error={errors.amount}
                    onChangeText={value => {
                      const formatedAmount = value;

                      setState(prevState => ({
                        ...prevState,
                        amount: formatedAmount,
                      }));
                      setFieldValue('amount', value);
                    }}
                    onBlur={() => setFieldTouched('amount', true)}
                  />
                )}
              </Formik>
              <SelectedBankAccountCard item={myBanks[selectedAccount]} />
              <View
                style={{
                  marginTop: 20,
                  alignItems: 'flex-end',
                  flex: 1,
                  paddingHorizontal: 25,
                }}>
                <Text size={12} color={'#A8A8A8'}>
                  Available Balance
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    height: s(14),
                  }}>
                  <View style={{height: s(14)}}>
                    <Icons.Naira
                      color={'#A8A8A8'}
                      size={s(11)}
                      style={{paddingTop: 5, paddingRight: 2}}
                    />
                  </View>

                  <Text fontType={FONTS.FREDOKA} color={'#A8A8A8'}>
                    {formatAmount(selectNGNWallet(data)?.amount)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <View
          style={{
            minHeight: 100,
            paddingTop: 40,
            paddingBottom: 20,
            justifyContent: 'flex-end',
            flex: 1,
            backgroundColor: COLORS.lightGrey,
            paddingHorizontal: 20,
          }}>
          <Button
            onPress={() => continueBtn()}
            title={currentPage == 1 ? 'Withdraw' : 'Continue'}
            rightIcon={
              <View
                style={{
                  transform: [{rotate: currentPage == 1 ? '90deg' : '0deg'}],
                }}>
                <Icons.CircleArrowYellow />
              </View>
            }
          />
        </View>
      </BottomSheetScrollView>
    </View>
  );
};
