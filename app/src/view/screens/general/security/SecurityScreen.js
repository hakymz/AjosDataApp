import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {
  CustomSafeAreaView,
  KeyboardAvoidingViewWrapper,
  MyIcons,
  Text,
} from '../../../components/general';
import Line from '../../../components/general/others/Line';
import {AppNav} from '../../../components/layouts';

const List = ({icon, name, ...props}) => {
  return (
    <TouchableOpacity {...props}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            height: s(40),
            width: s(40),
            backgroundColor: COLORS.light,
            borderRadius: 100,
            marginRight: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
        </View>
        <Text semiBold>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};
export const SecurityScreen = ({navigation}) => {
  const {data} = useUser();
  console.log(data?.user?.transactionPin, 'Pinn nnn');
  return (
    <CustomSafeAreaView>
      <AppNav title={'Security'} line />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{paddingTop: 0, paddingHorizontal: 20}}>
        <List
          onPress={() => navigation.navigate('UpdatePasswordScreen')}
          icon={<MyIcons.LockCardGreen size={22} />}
          name={'Change Password'}
        />
        <Line style={{marginVertical: 0}} />
        <List
          onPress={() =>
            navigation.navigate('SetPinScreen', {
              type: data?.user?.transactionPin == 'NULL' ? 'set' : 'change',
            })
          }
          icon={<MyIcons.Pin size={22} />}
          name={
            data?.user?.transactionPin == 'NULL'
              ? 'Set Transaction Pin'
              : 'Change Transaction Pin'
          }
        />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
