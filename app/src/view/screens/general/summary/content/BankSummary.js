import React from 'react';
import {StyleSheet, View} from 'react-native';
import {SectionList} from '../../../../components/lists';
import {Image} from 'react-native-svg';
import {COLORS, GENERAL} from '../../../../../conts';
import {
  CopyIcon,
  MyIcons,
  StatusComponent,
  Text,
} from '../../../../components/general';
import {formatAmount, getStatusColor} from '../../../../../helper';
export const BankSummary = ({details}) => {
  let state = details?.state;
  if (state == 'processed') {
    state = 'successful';
  } else if (state == 'declined') {
    state = 'failed';
  }

  const dataList = [
    {
      title: details?.metaInfo?.account_name,
      des: 'Account Name',
      right: <View style={{...style.iconCon}}>{details?.icon}</View>,
    },
    {
      title: details?.metaInfo?.receiver,
      des: 'Account Number',
    },
    {
      title: `+ ${GENERAL.nairaSign}${details?.metaInfo?.fee}`,
      des: 'Amount',
      right: (
        <Text semiBold lineHeight={24} size={20}>
          {GENERAL.nairaSign}
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
      title: `${details?.transactionId}`,
      des: 'Transaction ID',
      right: <CopyIcon text={details?.transactionId} />,
    },

    {
      title: details?.metaInfo?.type,
      des: 'Description',
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
