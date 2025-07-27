import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, GENERAL, IMAGES, NETWORKS} from '../../../../conts';
import {fetchRequest, formatAmount} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';

const List = ({name, details}) => {
  return (
    <View
      style={{
        height: 62,
        justifyContent: 'flex-end',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 10,
        marginBottom: 10,
      }}>
      <Text size={16} bold>
        {details}
      </Text>
      <Text size={11} color={'#979797'}>
        {name}
      </Text>
    </View>
  );
};
const Cashback = ({useCashback, state, setState}) => {
  const {data} = useUser();
  const maincashbackBalance = data?.wallet?.cashback?.balance;

  return (
    <View style={{height: 32, marginTop: 10, flexDirection: 'row'}}>
      <View
        style={{
          backgroundColor: '#F8F8F8',
          flex: 1,
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}>
        <Text
          style={{
            textDecorationLine: state?.useCashback ? 'line-through' : null,
          }}
          fontWeight="700"
          size={15}
          color={state?.useCashback ? '#979797' : COLORS.primary}>
          {GENERAL.nairaSign} {formatAmount(state?.cashbackBalance)}
        </Text>
        <Text
          numberOfLines={1}
          style={{flex: 1}}
          color={state?.useCashback ? '#979797' : COLORS.primary}
          fontWeight={'500'}
          size={10}>
          {' '}
          - Cashback Balance
        </Text>
      </View>
      <TouchableOpacity
        disabled={maincashbackBalance < 1}
        onPress={() => {
          if (state?.cashbackBalance > 0) {
            setState(prevState => {
              let cashbackBalance = prevState?.cashbackBalance;

              if (!prevState?.useCashback) {
                if (cashbackBalance > prevState?.amount) {
                  totalAmount = 0;
                  cashbackBalance = maincashbackBalance - prevState?.amount;
                } else {
                  totalAmount = prevState?.amount - cashbackBalance;
                  cashbackBalance = maincashbackBalance;
                }
              } else {
                totalAmount = prevState?.amount;
                cashbackBalance = maincashbackBalance;
              }
              return {
                ...prevState,
                useCashback: !prevState?.useCashback,
                totalAmount: totalAmount,
                cashbackBalance,
              };
            });
          }
        }}
        style={{
          width: 121,
          borderWidth: 1,
          borderColor: useCashback ? '#3BA935' : '#7F8192',
          borderRadius: 6,
          marginLeft: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          size={13}
          fontWeight={'800'}
          color={useCashback ? '#3BA935' : '#7F8192'}>
          Use Cashback
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const BillsTransactionSummary = ({
  btnTitle = 'Data',
  details,
  detailsList,
  proceed,
  logo,
}) => {
  const navigation = useNavigation();
  const {data} = useUser();

  const maincashbackBalance = data?.wallet?.cashback?.balance;
  const [state, setState] = React.useState({
    totalAmount: details?.amount,
    amount: details?.amount,
    useCashback: false,
    cashbackBalance: maincashbackBalance,
  });

  // const detailsList = [
  //   details?.type == 'Data' && {
  //     title: 'Data Type',
  //     value: details?.variation_code?.name || details?.dataType,
  //   },
  //   details?.type == 'Airtime' && {
  //     title: 'Amount',
  //     value: GENERAL.nairaSign + formatAmount(details?.amount),
  //   },
  //   {title: 'Customer’s Number', value: details?.phone},
  //   {
  //     title: `Receivable Cashback - ${
  //       details?.variation_code?.cashback ||
  //       details?.cashbackPer ||
  //       details?.cashback
  //     }%`,
  //     value:
  //       GENERAL.nairaSign +
  //       formatAmount(
  //         (details?.amount *
  //           (details?.variation_code?.cashback ||
  //             details?.cashbackPer ||
  //             details?.cashback)) /
  //           100,
  //       ),
  //   },
  // ];

  return (
    <View style={{paddingHorizontal: 20}}>
      <Text bold textAlign={'center'} size={22}>
        Summary
      </Text>

      <View style={{marginTop: 20, marginBottom: 30}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
            backgroundColor: '#E9E6F7',
            paddingHorizontal: 15,
            borderRadius: 12,
          }}>
          <Image style={{height: 43, width: 43}} source={logo} />
          <Text medium size={16} color={COLORS.blue}>
            Airtime Purchase
          </Text>
        </View>
      </View>

      <View>
        {detailsList?.map(item => {
          if (item) {
            return <List {...item} />;
          }
        })}
        <Cashback
          state={state}
          setState={setState}
          useCashback={state?.useCashback}
        />
        <View
          style={{
            height: 54,
            flex: 1,
            backgroundColor: '#EFF1FB',
            marginTop: 17,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            justifyContent: 'space-between',
          }}>
          <Text fontWeight={'500'} size={13} color={COLORS.blue}>
            {state?.useCashback ? 'New Total' : 'Total'}
          </Text>
          <Text color={COLORS.blue} size={20} fontWeight={'500'}>
            {GENERAL.nairaSign}
            {formatAmount(state?.totalAmount)}
          </Text>
        </View>
      </View>
      <View style={{marginTop: 60}}>
        <Text style={{marginBottom: 20}} bold size={20} textAlign={'center'}>
          Total - ₦{formatAmount(details?.amount)}
        </Text>
        <Button
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('PinScreen', {
              proceed: pin => {
                proceed(pin, state?.useCashback);
              },
            });
          }}
          style={{flex: 1, paddingHorizontal: 10}}
          fontSize={14}
          title={`Make Payment`}
        />
      </View>
    </View>
  );
};
