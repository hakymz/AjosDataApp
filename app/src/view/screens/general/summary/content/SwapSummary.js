import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SectionList} from '../../../../components/lists';
import {Image} from 'react-native-svg';
import {COLORS, GENERAL} from '../../../../../conts';
import {MyIcons, StatusComponent, Text} from '../../../../components/general';
import {formatAmount, getStatusColor} from '../../../../../helper';
export const SwapSummary = ({details}) => {
  let state = details?.state;

  if (state == 'processed') {
    state = 'successful';
  } else if (state == 'declined') {
    state = 'failed';
  }
  const dataList = [
    {
      title: details?.receiptDetails?.name,
      des: 'Payment Type',
      right: (
        <View style={{...style.iconCon}}>
          <MyIcons.SwapGreen size={15} />
        </View>
      ),
    },
    {
      title: `+ ${
        details?.currency == 'USD' ? GENERAL.dollarSign : GENERAL.dollarSign
      }${details?.metaInfo?.fee}`,
      des: 'Amount',
      right: (
        <Text semiBold lineHeight={24} size={20}>
          {details?.currency == 'USD' ? GENERAL.dollarSign : GENERAL.nairaSign}
          {formatAmount(details?.amount)}
        </Text>
      ),
    },
    {
      title: (
        <Text color={getStatusColor(details?.state)} bold size={13}>
          {state?.toUpperCase?.()}
        </Text>
      ),
      des: 'Transaction Status',

      rightComponent: <StatusComponent status={details?.state} />,
    },
    {
      title: `${details?.transactionId}0`,
      des: 'Transaction ID',
      copy: true,
    },
  ];
  return (
    <View>
      <SectionList item={dataList} />
    </View>
  );
};

const style = StyleSheet.create({
  iconCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});
