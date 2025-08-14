import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {BottomSheets, Button, Text} from '../../general';
import {COLORS, GENERAL} from '../../../../conts';
import {formatAmount} from '../../../../helper';
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
    <View style={{height: 34, marginTop: 10, flexDirection: 'row'}}>
      <View
        style={{
          backgroundColor: state?.useCashback ? '#FFEDEF' : '#E9E6F7',
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
          borderRadius: 32,
        }}>
        <Text
          style={{
            textDecorationLine: state?.useCashback ? 'line-through' : null,
          }}
          fontWeight="700"
          size={12}
          color={state?.useCashback ? '#D12431' : COLORS.darkBlue}>
          Available Cashback
          {GENERAL.nairaSign} {formatAmount(state?.cashbackBalance)}
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
          backgroundColor: useCashback ? '#CED5DA' : '#CBDB31',
          borderRadius: 32,
          marginLeft: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text medium size={12} fontWeight={'800'} color={'#151521'}>
          Use Cashback
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const BillsTransactionSummary = ({
  details,
  detailsList,
  proceed,
  title = 'Airtime Purchase',
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
          <Image
            style={{height: 43, width: 43, borderRadius: 50}}
            source={typeof logo == 'string' ? {uri: logo} : logo}
          />
          <Text medium size={16} color={COLORS.darkBlue}>
            {title}
          </Text>
        </View>
      </View>

      <View>
        {detailsList?.map?.(item => {
          if (item) {
            return <List {...item} />;
          }
        })}
        <Cashback
          state={state}
          setState={setState}
          useCashback={state?.useCashback}
        />
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
                proceed?.(pin, state?.useCashback);
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
