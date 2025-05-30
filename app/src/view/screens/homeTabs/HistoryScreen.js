import React from 'react';
import {
  ScrollView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {fetchRequest, formatAmount} from '../../../helper';

import {
  BottomSheets,
  CustomSafeAreaView,
  InfiniteFlatList,
  SearchInput,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';
import {useQuery, useQueryClient} from 'react-query';

import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {TransactionSummary} from '../../components/bottomSheetModal/contents';
import {Image} from '../../components/general/image';

const List = ({item}) => {
  let des = '';

  if (item?.receiptDetails?.info == 'Airtime Recharge') {
    des = item?.receiptDetails?.metaInfo?.receiver;
  } else {
    des = item?.receiptDetails?.type;
  }
  return (
    <TouchableOpacity
      onPress={() => {
        BottomSheets.show({
          component: <TransactionSummary details={item} />,
          // customSnapPoints: ['85%', '85%'],
          disableScrollIfPossible: false,
        });
      }}
      style={{
        height: 80,
        backgroundColor: COLORS.white,
        marginBottom: 15,
        borderRadius: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E9F1FF',
      }}>
      <View style={{flex: 1}}>
        <Text fontWeight={700} size={14} color={'#4961AC'}>
          {item?.receiptDetails?.info == 'Data Transfer'
            ? 'Data to Cash'
            : item?.receiptDetails?.info}
        </Text>
        <Text
          style={{marginTop: 5}}
          fontWeight={500}
          color={'#7F8192'}
          size={10}>
          {moment(item?.created_at).format('DD-MMM-YYYY')} |{' '}
          {/* {moment(item?.created_at).format('h:mA')} */}
          {item?.receiptDetails?.metaInfo?.receiver}
        </Text>
      </View>
      <View>
        <Text
          fontWeight={'500'}
          size={18}
          color={item?.status == 'debit' ? '#D12431' : '#3BA935'}>
          {GENERAL.nairaSign}
          {formatAmount(item?.amount)}
        </Text>
      </View>
      <Image
        source={{uri: item?.imageUrl || item?.image}}
        style={{height: 43, width: 43, borderRadius: 40}}
      />
    </TouchableOpacity>
  );
};

export const HistoryScreen = ({navigation}) => {
  const getWalletHistory = async ({pageParam = 0}) => {
    try {
      const response = await fetchRequest({
        path: `/transaction?page=${pageParam}&limit=10`,
        method: 'GET',
        displayMessage: false,
        showLoader: false,
      });

      return {...response?.data, current_page: pageParam};
    } catch (error) {
      throw error;
    }
  };

  return (
    <CustomSafeAreaView>
      <MainHeader title={'History'} nav />
      <View style={{paddingHorizontal: 20, marginTop: 20}}>
        <Text size={12} color={'#898A8D'}>
          Here are all your transactions done on the app.
        </Text>
        <SearchInput style={{marginTop: 10, backgroundColor: COLORS.white}} />
      </View>
      <InfiniteFlatList
        renderItem={({item}) => <List item={item} />}
        request={getWalletHistory}
        queryKey="getWalletHistory"
      />
    </CustomSafeAreaView>
  );
};
