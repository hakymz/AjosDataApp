import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {BottomSheets, Button, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, GENERAL, IMAGES, NETWORKS} from '../../../../conts';
import {fetchRequest, formatAmount} from '../../../../helper';
import {useUser} from '../../../../hooks';
import {useNavigation} from '@react-navigation/native';

const List = ({title, value}) => {
  return (
    <View
      style={{
        height: 54,
        borderRadius: 8,
        backgroundColor: '#F8F8F8',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        marginBottom: 7,
      }}>
      <Text
        numberOfLines={1}
        style={{paddingRight: 10, maxWidth: 200}}
        fontWeight={'500'}
        size={13}
        color={'#979797'}>
        {title}
      </Text>
      <Text
        textAlign={'right'}
        numberOfLines={1}
        size={16}
        color={COLORS.blue}
        fontWeight={'500'}
        style={{flex: 1}}>
        {value}
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

export const ResellTransactionSummary = ({
  btnTitle = 'Data',
  details,
  proceed,
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

  const detailsList = [
    details?.type == 'Data' && {
      title: 'Data Type',
      value: details?.variation_code?.name || details?.dataType,
    },
    details?.type == 'Airtime' && {
      title: 'Amount',
      value: GENERAL.nairaSign + formatAmount(details?.amount),
    },
    {title: 'Customer’s Number', value: details?.phone},
    {
      title: `Receivable Cashback - ${
        details?.variation_code?.cashback ||
        details?.cashbackPer ||
        details?.cashback
      }%`,
      value:
        GENERAL.nairaSign +
        formatAmount(
          (details?.amount *
            (details?.variation_code?.cashback ||
              details?.cashbackPer ||
              details?.cashback)) /
            100,
        ),
    },
  ];

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        {details?.type} Resell
      </Text>

      <View style={{marginTop: 20, marginBottom: 30, paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 30,
          }}>
          <Image
            style={{height: 47, width: 47}}
            source={
              typeof details?.network?.image == 'string' || details?.logo
                ? {uri: details?.network?.image || details?.logo}
                : details?.network?.image
            }
          />
          <Text
            style={{marginLeft: 10}}
            fontWeight={'500'}
            size={25}
            color={COLORS.blue}>
            {details?.network?.name} {details?.type}
          </Text>
        </View>
        <Text size={14} fontWeight={'500'}>
          Here is a summary of your purchase and how much cashback you will
          receive
        </Text>
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
      <View style={{flexDirection: 'row', marginTop: 30}}>
        <Button
          type="lightGrey"
          style={{
            width: 122,
            paddingHorizontal: 10,
          }}
          fontSize={14}
          title={'Cancel'}
        />
        <View style={{width: 10}} />
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
          title={`Purchase ${btnTitle}`}
        />
      </View>
    </View>
  );
};
