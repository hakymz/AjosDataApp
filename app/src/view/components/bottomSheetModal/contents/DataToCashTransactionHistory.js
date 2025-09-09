import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BottomSheets, InfiniteFlatList, Text} from '../../general';

import {fetchRequest, formatAmount} from '../../../../helper';
import moment from 'moment';
import {GENERAL} from '../../../../conts';
// import {TransactionSummary} from './TransactionSummary';

export const DataToCashTransactionHistory = ({data}) => {
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
            customSnapPoints: ['85%', '85%'],
          });
        }}
        style={{
          height: 70,
          backgroundColor: '#EFF1FB',
          marginBottom: 10,
          borderRadius: 8,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text fontWeight={700} size={14} color={'#4961AC'}>
            {item?.receiptDetails?.info}
          </Text>
          <Text
            style={{marginTop: 5}}
            fontWeight={500}
            color={'#7F8192'}
            size={11}>
            {moment(item?.created_at).format('DD-MMM-YYYY, hh:mmA')}
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
      </TouchableOpacity>
    );
  };
  const getHistory = async ({pageParam = 0}) => {
    try {
      const response = await fetchRequest({
        path: `billpayment/reseller/sim/history?id=${data?._id}&page=${pageParam}&limit=10`,
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
    <View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 24,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <Text
          style={{paddingLeft: 10}}
          textAlign={'right'}
          size={18}
          fontWeight={800}>
          Data History
        </Text>
      </View>
      <InfiniteFlatList
        renderItem={({item}) => <List item={item} />}
        noDataCom={
          <View style={{marginBottom: 40}}>
            <Text fontWeight={'500'} size={20} semiBold textAlign={'center'}>
              No Data
            </Text>
          </View>
        }
        request={getHistory}
        queryKey="getHistoryConvertToData"
      />
    </View>
  );
};
