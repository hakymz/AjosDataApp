import React from 'react';
import {View} from 'react-native';
import {COLORS, GENERAL} from '../../../../conts';
import {BottomSheets, Button, MyIcons, Text} from '../../general';
import {AccountDetails} from './AccountDetails';
import {useUser} from '../../../../hooks';
export const GenerateAccount = () => {
  const {settings} = useUser();
  return (
    <View style={{paddingHorizontal: 30, marginBottom: 30}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}>
        <Text bold color={COLORS.primary} lineHeight={25} size={20}>
          Generate Account
        </Text>
        <MyIcons.BankGreen size={23} />
      </View>
      <Text color={'#666766'} lineHeight={17}>
        We will need to generate an account which will be unique for you and to
        you. You will be able to fund your Naira wallet anytime and anywhere
        with this.
      </Text>
      <View style={{paddingHorizontal: 15, marginTop: 40}}>
        <Button
          onPress={() => {
            BottomSheets.show({
              component: <AccountDetails />,
              customSnapPoints:
                settings?.currency == GENERAL.USD
                  ? ['85%', '85%']
                  : ['75%', '75%'],
            });
          }}
          type="black"
          title={'Generate Bank Account'}
        />
      </View>
    </View>
  );
};
