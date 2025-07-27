import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {useUser} from '../../../../hooks';
import {
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {PageList} from '../../../components/lists';

const List = ({title, icon, ...props}) => {
  return (
    <PageList {...props}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {icon}
        <Text
          style={{marginLeft: 10}}
          size={16}
          color={COLORS.darkBlue}
          semiBold>
          {title}
        </Text>
      </View>
    </PageList>
  );
};

export const SecurityScreen = ({navigation}) => {
  const {data} = useUser();

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.Unlock size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Security
        </Text>
        <Text
          style={{marginTop: 5, marginBottom: 25}}
          size={12}
          medium
          color={'#979797'}>
          You can change or reset your password or PIN to enable a safer app
          experience
        </Text>
        <List
          icon={<Icons.Lock size={24} />}
          title={'Change Password'}
          onPress={() => {
            navigation.navigate('UpdatePasswordScreen');
          }}
        />
        <List
          icon={<Icons.Key size={24} />}
          title={'Reset Password'}
          onPress={() => {
            navigation.navigate('ResetPasswordScreen');
          }}
        />
        <List
          icon={<Icons.AddCategory size={24} />}
          title={'Change PIN'}
          onPress={() => {
            navigation.navigate('ChangePinScreen');
          }}
        />
        <List icon={<Icons.Scan2 size={24} />} title={'Reset PIN'} />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
