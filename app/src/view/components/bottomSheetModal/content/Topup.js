import React from 'react';
import {View, TouchableOpacity, Keyboard} from 'react-native';
import {Button, Icons, Input, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {usePayments, useUser, useWallet} from '../../../../hooks';
import {
  fetchRequest,
  openBrowser,
  openLink,
  scaleFont,
} from '../../../../helper';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TransactionStatusModal} from '../TransactionStatusModal';
import Toast from '../../toast/Toast';
import {BottomSheets} from '../BottomSheets';
import {Image} from '../../general/image';
const validationSchema = yup.object().shape({
  amount: yup.number().required('Please input amount'),
});

const List = ({
  item,
  showDeletButton = true,
  onPress = null,
  onDelete = () => {},
  backgroundColor,
}) => {
  return (
    <View
      style={{
        paddingBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={{
          height: s(55),
          backgroundColor: backgroundColor || COLORS.white,
          flex: 1,
          borderRadius: 30,
          flexDirection: 'row',
          paddingHorizontal: 20,
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <Text medium color={COLORS.voodoo}>
            ****
          </Text>
          <Text medium color={COLORS.voodoo}>
            ****
          </Text>
          <Text medium color={COLORS.voodoo}>
            ****
          </Text>
          <Text medium color={COLORS.voodoo}>
            {item?.last_4digits}
          </Text>
        </View>
        <View style={{width: 30, justifyContent: 'center', marginLeft: 10}}>
          <Image
            style={{height: s(30), width: '100%', resizeMode: 'contain'}}
            source={
              item?.type == 'MASTERCARD'
                ? require('../../../../assets/images/others/masterCard.png')
                : require('../../../../assets/images/others/visa.png')
            }
          />
        </View>
      </TouchableOpacity>
      {showDeletButton && (
        <TouchableOpacity
          onPress={onDelete}
          style={{
            height: s(55),
            width: s(55),
            backgroundColor: COLORS.white,
            borderRadius: 70,
            marginLeft: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icons.CancelRedCircle />
        </TouchableOpacity>
      )}
    </View>
  );
};

const AddButton = ({onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 10,
        paddingHorizontal: 30,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-end',
      }}>
      <View
        style={{
          height: s(60),
          backgroundColor: COLORS.white,
          borderRadius: 70,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text medium>Add New Card</Text>
      </View>
      <View
        style={{
          height: s(60),
          width: s(60),
          backgroundColor: '#DCE1FA',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 10,
        }}>
        <Icons.TopUp size={35} />
      </View>
    </TouchableOpacity>
  );
};

const CardPage = ({state, setState}) => {
  const {cards} = usePayments();

  const addCard = async values => {
    try {
      const response = await fetchRequest({
        path: 'card/new',
        method: 'POST',
      });
      console.log(response);

      if (response?.status == 'success' && response?.data) {
        BottomSheets.hide();
        //Open link
        openBrowser(response?.data?.link);
        // openLink(response?.data?.link);
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Image
          style={{
            height: s(157),
            resizeMode: 'contain',
            width: 256,
            marginTop: 10,
          }}
          source={require('../../../../assets/images/others/card.png')}
        />
      </View>
      {(cards ?? [])?.map?.((item, key) => (
        <List
          item={item}
          key={'cards' + key}
          onPress={() => {
            setState(prevState => ({
              ...prevState,
              page: 'topUp',
              title: 'This Card will be debited',
              selectedCard: item,
            }));
          }}
          onDelete={() => {
            setState(prevState => ({
              ...prevState,
              page: 'delete',
              title: 'Are you sure you want to Delete this Card?',
              deleteCard: item,
            }));
          }}
        />
      ))}
      {!cards?.length && (
        <Text
          fontType={FONTS.FREDOKA}
          size={18}
          textAlign="center"
          color="#4B2A85"
          style={{paddingHorizontal: 40, marginTop: 10}}>
          No Saved Cards
        </Text>
      )}

      <AddButton onPress={addCard} />
    </View>
  );
};

const TopUpPage = ({state, setState}) => {
  const {getAllCards} = usePayments();

  const {getAndUpdateUserData} = useUser();
  const {getWalletHistory} = useWallet();
  const addMoneyToWallet = async values => {
    try {
      const response = await fetchRequest({
        path: 'wallets/add-money',
        method: 'POST',
        data: {
          ...values,
          token: state?.selectedCard?.token,
        },
      });

      if (response?.status == 'success' && response?.data) {
        TransactionStatusModal({type: 'success'});
        getWalletHistory();
        getAndUpdateUserData();
      } else {
        TransactionStatusModal({type: 'error', message: response?.message});
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Formik
      initialValues={{amount: ''}}
      validationSchema={validationSchema}
      onSubmit={values => {
        addMoneyToWallet(values);
      }}>
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
        <View style={{marginTop: 20, flex: 1}}>
          <View style={{paddingHorizontal: 30}}>
            <List
              showDeletButton={false}
              item={state?.selectedCard}
              onPress={() => {
                setState(prevState => ({
                  ...prevState,
                  page: 'topUp',
                  title: 'This Card will be debited',
                  selectedCard: item,
                }));
              }}
            />
          </View>
          <View style={{paddingHorizontal: 20}}>
            <Text
              color={COLORS.lightBlue}
              size={18}
              fontType={FONTS.FREDOKA}
              textAlign="center"
              style={{marginTop: 20, marginBottom: 20}}>
              How Much?
            </Text>
            {/* amount input */}
            <Input
              editable={state?.type?.value != 'data'}
              value={values.amount}
              error={touched?.amount && errors?.amount}
              onChangeText={value => {
                setFieldValue('amount', value);
                setState(prevState => ({
                  ...prevState,
                  amount: value,
                }));
              }}
              onFocus={() => {
                setState(prevState => ({
                  ...prevState,
                  amountInputIsFocused: true,
                }));
              }}
              onBlur={() => {
                setFieldTouched('amount', true);
                setState(prevState => ({
                  ...prevState,
                  amountInputIsFocused: false,
                }));
              }}
              inputStyle={{
                fontSize:
                  errors?.amount &&
                  touched.amount &&
                  !state.amountInputIsFocused
                    ? scaleFont(14)
                    : scaleFont(20),
                fontFamily:
                  errors?.amount &&
                  touched.amount &&
                  !state.amountInputIsFocused
                    ? FONTS.WORKSANS_FONTS.medium
                    : FONTS.WORKSANS_FONTS.regular,
              }}
              conStyle={{marginBottom: 0}}
              placeholder="0.00"
              keyboardType="numeric"
              backgroundColor={COLORS.white}
              textColor={COLORS.lightBlue}
              leftIcon={
                <Text
                  color={
                    errors?.amount &&
                    touched.amount &&
                    !state.amountInputIsFocused
                      ? COLORS.red
                      : COLORS.lightBlue
                  }
                  size={
                    errors?.amount &&
                    touched.amount &&
                    !state.amountInputIsFocused
                      ? 14
                      : 20
                  }
                  style={{
                    top:
                      errors?.amount &&
                      touched.amount &&
                      !state.amountInputIsFocused
                        ? 0
                        : 4,
                    paddingRight: 1,
                  }}>
                  ₦
                </Text>
              }
              errorTextSize={14}
            />
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <Button
              onPress={() => {
                handleSubmit();
                Keyboard.dismiss();
              }}
              title="Top Up my Wallet"
              rightIcon={<Icons.CircleArrowYellow />}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const DeletePage = ({state, setState}) => {
  const {getAllCards} = usePayments();
  const deleteCard = async values => {
    try {
      const response = await fetchRequest({
        path: 'card/delete/' + state?.deleteCard?._id,
        method: 'DELETE',
      });

      if (response?.status == 'success' && response?.data) {
        getAllCards();
        BottomSheets.hide();
        Toast.show('success', 'Card deleted successfully');
      } else {
        Toast.show('error', response?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{marginTop: 10, flex: 1}}>
      <View style={{paddingHorizontal: 30}}>
        <List
          backgroundColor="rgba(255, 0, 0, 0.12)"
          showDeletButton={false}
          item={state?.deleteCard}
        />
      </View>
      <View
        style={{paddingHorizontal: 20, alignItems: 'center', marginTop: 20}}>
        <Image
          style={{height: s(147), width: s(147), resizeMode: 'contain'}}
          source={require('../../../../assets/images/avatars/girl3.png')}
        />
        <Button
          onPress={deleteCard}
          title="Yes delete"
          style={{backgroundColor: '#CB1A1A', marginTop: 30}}
          rightIcon={<Icons.CancelWhiteCircle />}
        />
      </View>
    </View>
  );
};

const RenderPage = ({state, setState}) => {
  if (state.page == 'topUp') {
    return <TopUpPage state={state} setState={setState} />;
  }
  if (state.page == 'delete') {
    return <DeletePage state={state} setState={setState} />;
  }
  return <CardPage state={state} setState={setState} />;
};

export const Topup = () => {
  const [state, setState] = React.useState({
    page: 'card',
    title: 'Here are your card(s)',
    selectedCard: null,
  });

  const {cards, getAllCards} = usePayments();
  React.useEffect(() => {
    getAllCards();
  }, []);

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      title:
        cards?.length > 0
          ? 'Here are your card(s)'
          : 'Enter your card details and save to top up in 1minute anytime.',
    }));
  }, [cards]);

  return (
    <View style={{height: '100%'}}>
      <View style={{paddingBottom: 10}}>
        <Text
          fontType={FONTS.FREDOKA_FONTS}
          color={COLORS.lightBlue}
          size={18}
          style={{textAlign: 'center'}}>
          Top-Up Wallet
        </Text>
        <Text
          color={'#727272'}
          size={14}
          style={{
            textAlign: 'center',
            paddingTop: 30,
            paddingHorizontal: 40,
          }}>
          {state.title}
        </Text>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          minHeight: '90%',
        }}>
        <RenderPage state={state} setState={setState} />
      </BottomSheetScrollView>
    </View>
  );
};
