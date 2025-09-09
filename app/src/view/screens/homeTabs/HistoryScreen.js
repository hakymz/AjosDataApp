import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {COLORS} from '../../../conts';
import {fetchRequest} from '../../../helper';

import {
  BottomSheets,
  CustomSafeAreaView,
  InfiniteFlatList,
  SearchInput,
  Text,
} from '../../components/general';
import {MainHeader} from '../../components/layouts';

import moment from 'moment';

import {Image} from '../../components/general/image';
import {TransactionSummary} from '../../components/bottomSheetModal/modalContents';

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
          disableScrollIfPossible: false,
          showCloseBtn: false,
        });
      }}
      style={{
        height: 80,
        backgroundColor: COLORS.white,
        marginBottom: 15,
        borderRadius: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#E9F1FF',
        justifyContent: 'center',
        paddingVertical: 10,
      }}>
      <Text color={'#848A94'} size={12}>
        {item?.category}
      </Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={{flex: 1}}>
          <Text
            style={{marginTop: 4}}
            numberOfLines={1}
            fontWeight={500}
            size={14}
            color={COLORS.darkBlue}>
            {JSON.parse(item?.receiptDetails)?.metaInfo?.description}
          </Text>
          <Text style={{marginTop: 4}} color={'#848A94'} size={12}>
            {moment(item?.created_at).format('DD-MMM-YYYY')} |{' '}
          </Text>
        </View>

        <Image
          source={{uri: item?.imageUrl || item?.image}}
          style={{height: 43, width: 43, borderRadius: 40}}
        />
      </View>
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
