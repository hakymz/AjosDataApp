import React from 'react';
import {
  CustomSafeAreaView,
  Icons,
  KeyboardAvoidingViewWrapper,
  Text,
} from '../../../components/general';
import {MainHeader} from '../../../components/layouts';
import {
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../../conts';

const ServiceCard = ({item, total = 3}) => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(item?.screen);
      }}
      style={{
        width: width / total - (total == 2 ? 30 : 25),
        height: 118,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}>
      {item?.icon}

      <View style={{marginTop: 10}}>
        <Text size={14} bold color={'#303437'}>
          {item?.name}
        </Text>
        <Text size={12} medium color={'#72777A'}>
          {item?.details}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export const BillsScreen = () => {
  const listData = [
    {
      name: 'Electricity',
      details: 'All DisCos',
      icon: <Icons.Plug size={32} />,
      screen: 'ElectricityScreen',
    },
    {
      name: 'Tv-Subscriptions',
      details: 'All major platforms',
      icon: <Icons.Tv size={32} />,
      screen: 'TvScreen',
    },
  ];
  const listData2 = [
    {
      name: 'WAEC',
      details: 'Token',
      icon: <Icons.Book1 size={32} />,
      screen: 'BillsScreen',
    },
    {name: 'NECO', details: 'Token', icon: <Icons.Book2 size={32} />},
    {name: 'NABTEB', details: 'Token', icon: <Icons.Book3 size={32} />},
  ];
  return (
    <CustomSafeAreaView>
      <MainHeader nav title={'Bill Payment'} />
      <KeyboardAvoidingViewWrapper contentContainerStyle={{paddingTop: 20}}>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{paddingHorizontal: 20}}
          data={listData}
          numColumns={2}
          renderItem={({item}) => <ServiceCard total={2} item={item} />}
        />
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{paddingHorizontal: 20}}
          data={listData2}
          numColumns={3}
          renderItem={({item}) => <ServiceCard item={item} />}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
            marginTop: 40,
          }}>
          <Image
            style={{height: 287, width: 287}}
            source={require('../../../../assets/images/others/pos.png')}
          />
        </View>
      </KeyboardAvoidingViewWrapper>
    </CustomSafeAreaView>
  );
};
