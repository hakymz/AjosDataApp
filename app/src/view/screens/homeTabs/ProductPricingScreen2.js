import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../../conts';
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

import {fetchRequest} from '../../../helper';
import {useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';

const List = ({item, category, ...props}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProductPricingScreen3', {category, item});
      }}
      {...props}
      style={{
        backgroundColor: '#EFF1FB',
        borderWidth: 0,
        flexDirection: 'row',
        height: 54,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        borderRadius: 8,
      }}>
      <Text size={16} color={COLORS.blue} fontWeight={'500'}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
};
export const ProductPricingScreen2 = ({navigation, route}) => {
  const {logoutUser, data, settings, updateUserData} = useUser();
  const {category, item} = route?.params || {};

  const getProductWithCat = async () => {
    console.log(category);
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
    if (products) {
      Object?.entries?.(products)?.forEach(([key, value]) => {
        currentList.push({name: key, value: value});
      });
    }

    return currentList;
  }, [products]);

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
            list?.map?.(item => <List category={category} item={item} />)
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};
