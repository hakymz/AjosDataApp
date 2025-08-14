import React from 'react';
import {Modal, ScrollView, TouchableOpacity, View} from 'react-native';
import {COLORS, GENERAL, IMAGES} from '../../../conts';
import {BottomSheets, Icons, Text} from '../general';
import {useUser} from '../../../hooks';
import {fetchRequest, formatAmount} from '../../../helper';
import {useQuery} from 'react-query';
import {Image} from '../general/image';
import {TopupOption} from '../bottomSheetModal/modalContents';
import {useNavigation} from '@react-navigation/native';

const Btn = ({icon, title, style, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{flex: 1, flexDirection: 'row', alignItems: 'center', ...style}}>
      <View
        style={{
          height: 25,
          width: 25,
          borderWidth: 1,
          borderRadius: 100,
          borderColor: COLORS.darkBlue,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {' '}
         {icon}
      </View>
      <Text medium size={13} color={'#151521'}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const AccountBalance = () => {
  const {data} = useUser();
  const [state, setState] = React.useState({showModal: false});
  const navigation = useNavigation();

  return (
    <View
      style={{
        height: 253,
        backgroundColor: '#4961AC',
        borderRadius: 26,
        paddingHorizontal: 10,
        paddingVertical: 10,

        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          justifyContent: 'space-between',
          marginTop: 15,
        }}>
        <View
          style={{
            height: 32,
            justifyContent: 'center',
          }}>
          <Text size={16} semiBold color={COLORS.white}>
            {GENERAL.nairaSign}
            {formatAmount(data?.user?.wallet?.cashback?.balance)}
          </Text>
          <Text size={12} color={COLORS.white}>
            Available Cashback for use
          </Text>
        </View>

        <View
          style={{
            height: 36,
            backgroundColor: '#384874',
            borderRadius: 18,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Image
            source={IMAGES.ngLogo}
            style={{height: 22, width: 22, marginRight: 5}}
          />
          <Text color={COLORS.white} size={12} medium>
            NGN
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 160,
          backgroundColor: COLORS.white,
          borderRadius: 18,
        }}>
        <View style={{paddingHorizontal: 15, paddingVertical: 15}}>
          <Text size={12} medium color={'#231F20'}>
            Available Funds
          </Text>
          <Text size={34} fontWeight={'500'} color={'#151521'}>
            {GENERAL.nairaSign}
            {formatAmount(data?.user?.wallet?.naira?.balance)?.split('.')[0]}.
            <Text size={34} fontWeight={'500'} color={'#BBBBBB'}>
              {formatAmount(data?.user?.wallet?.naira?.balance)?.split('.')[1]}
            </Text>
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.backgroundColor,
            marginHorizontal: 5,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            paddingHorizontal: 20,
          }}>
          <Btn
            onPress={() => {
              BottomSheets.show({component: <TopupOption />});
            }}
            title={'Add Funds'}
            icon={<Icons.Plus size={12} />}
          />
          <View
            style={{
              height: '100%',
              width: 1,
              backgroundColor: COLORS.backgroundColor,
            }}
          />
          <Btn
            onPress={() => {
              navigation.navigate('CustomersScreen');
            }}
            title={'Customers'}
            style={{marginLeft: 20}}
            icon={<Icons.StickMan size={12} />}
          />
        </View>
      </View>
    </View>
  );
};
