import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from 'react-query';
import {fetchRequest} from '../../../../helper';
import {
  CustomSafeAreaView,
  InfiniteFlatList,
  MyIcons,
  Text,
} from '../../../components/general';
import {AppNav, MainHeader} from '../../../components/layouts';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import moment from 'moment';
import {TransactionListSection} from '../../../components/lists';
import {useNavigation} from '@react-navigation/native';

const getNotification = async ({pageParam = 0}) => {
  try {
    const response = await fetchRequest({
      path: `/notification?page=${pageParam}&limit=10`,
      method: 'GET',
      displayMessage: true,
      showLoader: false,
    });

    return {...response?.data, current_page: pageParam};
  } catch (error) {
    throw error;
  }
};

const List = ({item}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('NotificationExpandedScreen', {...item});
      }}
      style={{
        minHeight: 80,
        marginBottom: 10,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#E9F1FF',
      }}>
      <Text numberOfLines={2} size={14} fontWeight={500} color={'#002055'}>
        {item?.description}
      </Text>
      <Text style={{marginTop: 5}} fontWeight={500} size={12} color={'#B0B0B0'}>
        {moment(item?.created_at).format('DD-MM-YYYY')}
      </Text>
    </TouchableOpacity>
  );
};

export const NotificationScreen = ({navigation}) => {
  return (
    <CustomSafeAreaView backgroundColor={COLORS.white}>
      <MainHeader title={'Notifications'} nav backgroundColor={COLORS.white} />

      <Text size={18} bold style={{paddingHorizontal: 20, margin: 20}}>
        Notifications 🔊
      </Text>

      <InfiniteFlatList
        renderItem={({item}) => <List item={item} />}
        request={getNotification}
        queryKey="getNotification"
      />
    </CustomSafeAreaView>
  );
};
