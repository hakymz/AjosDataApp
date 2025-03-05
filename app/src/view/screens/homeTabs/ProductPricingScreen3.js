import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {useUser} from '../../../hooks';

import {} from '../../components/bottomSheetModal/content';
import {
  BottomSheets,
  CustomSafeAreaView,
  ErrorButton,
  Icons,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {PageList} from '../../components/lists';

import {
  UserDetails,
  Settings,
  ContactUs,
  UpdateNotification,
} from '../../components/bottomSheetModal/contents';

import {BioMetricSettings} from '../../components/bottomSheetModal/contents/BioMetricSettings';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchRequest, openLink} from '../../../helper';
import {useQuery} from 'react-query';

const List = ({item, icon, ...props}) => {
  console.log(item);
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        {...props}
        style={{
          backgroundColor: '#F8F8F8',
          borderWidth: 0,
          flexDirection: 'row',
          height: 54,
          marginBottom: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          borderRadius: 8,
          flex: 1,
        }}>
        <Text
          numberOfLines={1}
          style={{marginRight: 5, flex: 1}}
          color="#979797"
          size={13}
          fontWeight={'500'}>
          {item?.plan}
        </Text>
        <Text size={14} color={COLORS.blue} fontWeight={'500'}>
          {GENERAL.nairaSign}
          {item?.amount}
        </Text>
      </TouchableOpacity>
      <View style={{width: 10}} />
      <TouchableOpacity
        {...props}
        style={{
          backgroundColor: '#F8F8F8',
          borderWidth: 0,
          flexDirection: 'row',
          height: 54,
          marginBottom: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          borderRadius: 8,
          flex: 1,
        }}>
        <Text
          numberOfLines={1}
          style={{marginRight: 5, flex: 1}}
          size={13}
          color={'#979797'}
          fontWeight={'500'}>
          Cashback
        </Text>
        <Text size={14} color={'#179338'} fontWeight={'500'}>
          {GENERAL.nairaSign}
          {item?.cashbackAmount}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export const ProductPricingScreen3 = ({navigation, route}) => {
  const {logoutUser, data, settings, updateUserData} = useUser();
  const {category, item} = route?.params || {};
  console.log(item);

  const getProductWithCat = async () => {
    try {
      const respose = await fetchRequest({
        path: 'products/prices?product=' + category,
        method: 'GET',
        showLoader: false,
      });
      console.log(respose);
      return respose?.data;
    } catch (error) {
      throw error;
    }
  };

  const {
    data: products,
    status,
    refetch,
    isFetching,
  } = useQuery('getProductWithCat' + category, getProductWithCat);

  const list = React.useMemo(() => {
    const currentList = [];
    if (item?.value) {
      Object?.entries?.(item?.value)?.forEach(([key, value]) => {
        currentList.push({name: key, value: value});
      });
    }
    return currentList;
  }, [item]);

  return (
    <CustomSafeAreaView>
      <MainHeader editPhoto />

      {status == 'error' ? (
        <ErrorButton refetch={refetch} isFetching={isFetching} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
          }}>
          <Text style={{marginBottom: 25}} size={18} fontWeight={'700'}>
            All Products + Pricing
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginBottom: 25,
            }}>
            <View
              style={{
                height: 28,
                borderWidth: 1,
                borderColor: '#898A8D',
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Text color={'#898A8D'} md size={12}>
                {category}
              </Text>
            </View>
          </View>

          {status == 'loading' ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
              }}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            list?.map?.(item => (
              <View>
                <Text style={{marginBottom: 20}} size={14} bd color={'#4961AC'}>
                  {item?.name}
                </Text>
                {item?.value?.map(item => (
                  <List item={item} />
                ))}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};
