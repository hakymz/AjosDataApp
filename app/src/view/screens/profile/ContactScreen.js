import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../conts';
import {useUser} from '../../../hooks';
import {
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {PageList} from '../../components/lists';

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

export const ContactScreen = ({navigation}) => {
  const {data} = useUser();

  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader
        backgroundColor={COLORS.white}
        nav
        title={<></>}
        icon={<Icons.SMS2 size={30} />}
      />
      <KeyboardAvoidingViewWrapper
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
        }}>
        <Text size={18} bold color={COLORS.darkBlue}>
          Contact Us
        </Text>
        <Text
          style={{marginTop: 5, marginBottom: 25}}
          size={12}
          medium
          color={'#979797'}>
          Our team of “customer-first” representatives are available from{' '}
          <Text
            style={{marginTop: 5, marginBottom: 25}}
            size={12}
            bold
            color={'#979797'}>
            {' '}
            8:00am - 8:00pm ( Mondays - Sundays )
          </Text>
        </Text>
        <List
          icon={<Icons.Message2 size={24} />}
          title={'Live-Chat'}
          onPress={() => {
            navigation.navigate('UpdatePasswordScreen');
          }}
        />
        <List
          icon={<Icons.Message3 size={24} />}
          title={'Whatsapp Chat'}
          onPress={() => {
            navigation.navigate('ResetPasswordScreen');
          }}
        />
        <List icon={<Icons.Message4 size={24} />} title={'SMS'} />
        <List icon={<Icons.Call size={24} />} title={'Call-us'} />
        <List icon={<Icons.Message5 size={24} />} title={'Email-us'} />
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
