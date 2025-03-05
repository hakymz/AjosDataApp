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

import {BioMetricSettings} from '../../components/bottomSheetModal/contents/BioMetricSettings';
import {launchImageLibrary} from 'react-native-image-picker';
import {fetchRequest, openLink} from '../../../helper';
import {useQuery} from 'react-query';
import {useNavigation} from '@react-navigation/native';

const List = ({item, icon, ...props}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProductPricingScreen2', {
          category: item?.category,
        });
      }}
      {...props}
      style={{
        backgroundColor: '#F8F8F8',
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
        {item?.category}
      </Text>
      <Icons.ArrowCircleRight size={24} />
    </TouchableOpacity>
  );
};
export const ProductPricingScreen = ({navigation, route}) => {
  const {category} = route?.params || {};
  const {logoutUser, data, settings, updateUserData} = useUser();

  const getProduct = async () => {
    try {
      const respose = await fetchRequest({
        path: 'products',
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
  } = useQuery('getProduct', getProduct);

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
            products?.map(item => <List item={item} />)
          )}
        </ScrollView>
      )}
    </CustomSafeAreaView>
  );
};
