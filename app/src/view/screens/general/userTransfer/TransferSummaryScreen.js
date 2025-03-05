import React from 'react';
import {View, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS, FONTS, GENERAL} from '../../../../conts';
import {
  fetchRequest,
  formatAmount,
  openSuccessScreen,
} from '../../../../helper';
import {useLayouts} from '../../../../hooks';
import {
  Button,
  CustomSafeAreaView,
  Input,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';

import {AppNav} from '../../../components/layouts';
import {SectionList} from '../../../components/lists';

const transfer = async (data, navigation) => {
  try {
    const response = await fetchRequest({
      path: 'wallet/user-transfer',
      pageError: {navigation},
      data: {
        amount: data?.amount,
        userTag: data?.username,
        saveBeneficiary: data?.save,
        transactionPin: data?.pin,
        note: data?.note,
      },
    });
    if (response?.status == 'success' && response?.data) {
      navigation.navigate('HomeScreen');
      openSuccessScreen({
        navigation,
        title: 'Another day, Another Successful Transaction!',
        subTitle: 'This should take a few seconds to reflect',
        btnTitle: 'View Transaction History',
        proceed: () => {
          navigation.navigate('HistoryNavigation');
        },
      });
    }
  } catch (error) {
    console.log(error, 'erroor ,,,,,');
  }
};
export const TransferSummaryScreen = ({navigation, route}) => {
  const details = route?.params || {};
  const {minHeight} = useLayouts();
  const [state, setState] = React.useState({text: ''});

  const sectionListData = [
    {
      des: 'Amount',
      desStyle: {fontSize: s(14)},
      right: (
        <Text style={{paddingVertical: 15}} semiBold>
          {GENERAL.nairaSign}
          {formatAmount(details?.amount)}
        </Text>
      ),
    },
    {
      des: 'Fees',
      desStyle: {fontSize: s(14)},
      right: (
        <Text style={{paddingVertical: 15}} semiBold>
          {GENERAL.nairaSign}
          {formatAmount(0)}
        </Text>
      ),
    },
    {
      des: 'Transfer speed',
      desStyle: {fontSize: s(14)},
      right: (
        <Text style={{paddingVertical: 15}} semiBold>
          Instant
        </Text>
      ),
    },
  ];

  return (
    <CustomSafeAreaView>
      <AppNav title={'Summary'} line />
      <KeyboardAvoidingViewWrapper
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
          paddingHorizontal: 20,
          minHeight: minHeight - 80,
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View style={style.bankIcon}>
            <Text bold size={20}>
              {details?.fullname?.split?.('')?.[0]}
            </Text>
          </View>
          <View style={{marginLeft: 10}}>
            <Text semiBold style={{paddingTop: 0}}>
              {details?.fullname}
            </Text>
            <Text size={12} semiBold color={'#7B7B7B'}>
              @ - {details?.username}
            </Text>
          </View>
        </View>

        <SectionList style={{marginTop: 30}} item={sectionListData} />

        <View style={{paddingHorizontal: 25, marginTop: 10}}>
          <Input
            onChangeText={value => {
              setState(prevState => ({...prevState, text: value}));
            }}
            value={state.text}
            inputStyle={{
              textAlign: 'center',
              fontSize: s(14),
              fontFamily: FONTS.EINA04_FONTS.semiBold,
            }}
            placeholder="Add Note (Optional)"
          />
        </View>
        <View
          style={{flex: 1, justifyContent: 'flex-end', paddingHorizontal: 0}}>
          <View style={{paddingHorizontal: 30}}>
            <Button
              type="black"
              title={'Purchase'}
              onPress={() => {
                navigation.navigate('PinScreen', {
                  method: pin =>
                    transfer({pin, ...details, note: state.text}, navigation),
                });
              }}
            />
          </View>
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
