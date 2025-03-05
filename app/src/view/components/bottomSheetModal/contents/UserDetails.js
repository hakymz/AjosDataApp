import React from 'react';
import {View, Image} from 'react-native';
import {Button, PageInput, Text} from '../../general';
import LottieView from 'lottie-react-native';
import {COLORS, GENERAL, IMAGES, NETWORKS} from '../../../../conts';
import {formatAmount} from '../../../../helper';
import {useUser} from '../../../../hooks';
import moment from 'moment';
const List = ({title, details}) => {
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
        {details}
      </Text>
    </View>
  );
};

export const UserDetails = ({}) => {
  const {data} = useUser();
  console.log(data?.user, 'dataa');
  return (
    <View style={{paddingHorizontal: 24, flex: 1}}>
      <Text textAlign={'right'} size={18} fontWeight={800}>
        User Details
      </Text>

      <View style={{marginTop: 20, marginBottom: 30}}>
        <Text lineHeight={17} color={'#828282'} size={12} fontWeight={'400'}>
          Here is a Summary of your registered details with us, please reach out
          to our customer care if you have issues
        </Text>
      </View>

      <View>
        <List
          title={'Full Name'}
          details={`${data?.user?.firstName} ${data?.user?.lastName}`}
        />
        <List title={'Phone Number'} details={`${data?.user?.phoneNumber}`} />
        <List title={'Email'} details={`${data?.user?.email}`} />
        <List
          title={'Date Registered'}
          details={moment(data?.user?.created_at)?.format('DD - MMM - YY')}
        />
      </View>
    </View>
  );
};
