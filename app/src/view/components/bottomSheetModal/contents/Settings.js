import React from 'react';
import {Image, View} from 'react-native';
import {BottomSheets, Button, Icons, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {PageList} from '../../lists';
import {COLORS, IMAGES} from '../../../../conts';
import {ChangePassword} from './ChangePassword';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../../../hooks';

const List = ({title, icon, ...props}) => {
  return (
    <PageList {...props}>
      <Text size={18} color={COLORS.blue} fontWeight={'500'}>
        {title}
      </Text>
      {icon}
    </PageList>
  );
};
export const Settings = () => {
  const navigation = useNavigation();
  const {data} = useUser();

  return (
    <View style={{paddingHorizontal: 24}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        Settings{' '}
      </Text>
      <View style={{marginTop: 20, marginBottom: 30}}>
        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          You can change your existing password or PIN with very quick and easy
          steps.
        </Text>
      </View>
      <View style={{flex: 1}}>
        <List
          title={'Change Password'}
          icon={<Icons.Pin size={20} />}
          onPress={() => {
            BottomSheets.show({
              component: <ChangePassword />,
              customSnapPoints: [550, 550],
            });
          }}
        />
        <List
          onPress={() => {
            BottomSheets.hide();
            navigation.navigate('SetPinScreen', {
              type: data?.user?.setTransactionPin ? 'old' : 'set',
            });
          }}
          title={data?.user?.setTransactionPin ? 'Change PIN' : 'Set PIN'}
          icon={<Icons.Padlock size={20} />}
        />
      </View>
    </View>
  );
};
