import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {BottomSheets, Text} from '../general';
import {useNavigation} from '@react-navigation/native';
import {DataToCashInfo, PayBills} from '../bottomSheetModal/contents';
import {COLORS} from '../../../conts';

const List = ({item}) => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          item?.onPress ? item?.onPress() : navigation.navigate(item?.screen);
        }}
        activeOpacity={0.7}
        style={{
          height: 90,
          backgroundColor: item?.backgroundColor,
          marginBottom: 12,
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}>
        <View style={{justifyContent: 'center', paddingLeft: 20}}>
          <Text color={item?.color} fontWeight={'800'} size={18}>
            {item?.title}
          </Text>
          <Text color={item?.desColor} size={10}>
            {item?.des}
          </Text>
        </View>
        <Image
          source={item?.image}
          style={{height: 90, width: 122, marginRight: 5}}
        />
      </TouchableOpacity>
      {item?.newFeature && (
        <View
          style={{
            position: 'absolute',
            right: 0,
            backgroundColor: '#D12431',
            paddingHorizontal: 7,
            borderRadius: 20,
            top: -5,
            height: 19,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text lineHeight={9} color={COLORS.white} size={9} fontWeight={'700'}>
            New Feature
          </Text>
        </View>
      )}
    </View>
  );
};

export const Services = ({navigation}) => {
  const listData = [
    {
      image: require('../../../assets/images/others/sellData.png'),
      title: 'Sell Data',
      des: 'Buy from us and Sell to your customers',
      backgroundColor: '#FFF3DA',
      color: '#9A1A23',
      desColor: '#9A1A23',
      screen: 'SellDataScreen',
    },
    {
      image: require('../../../assets/images/others/sellAirtime.png'),
      title: 'Sell Airtime',
      des: 'Get Airtime at lower rates than usual',
      backgroundColor: '#D7D9FF',
      color: '#4961AC',
      desColor: '#4961AC',
      screen: 'SellAirtimeScreen',
    },
    {
      image: require('../../../assets/images/others/cashInhand.png'),
      title: 'Data - Cash',
      des: 'Earn Daily - Sell your Data for instant Cash',
      backgroundColor: '#FFD7D7',
      color: '#D12431',
      desColor: '#9A1A23',
      screen: 'BulkSmsScreen',
      newFeature: true,
      onPress: () => {
        BottomSheets.show({
          component: <DataToCashInfo />,
        });
      },
    },
    // {
    //   image: require('../../../assets/images/others/bulkSms.png'),
    //   title: 'Bulk SMS',
    //   des: 'Stay professional with Bulk SMS',
    //   backgroundColor: '#D7E4FF',
    //   color: '#4961AC',
    //   desColor: '#4961AC',
    //   screen: 'BulkSmsRuleScreen',
    // },
    {
      image: require('../../../assets/images/others/payBills.png'),
      title: 'Pay Bills',
      des: 'Electricity, TV subscription , E pins.',
      backgroundColor: '#FCDCD3',
      color: '#D12431',
      desColor: '#9A1A23',
      onPress: () => {
        BottomSheets.show({
          component: <PayBills />,
          customSnapPoints: [450, 450],
        });
      },
    },
  ];
  return (
    <View style={{marginTop: 20}}>
      {listData.map((item, index) => (
        <List item={item} />
      ))}
    </View>
  );
};
