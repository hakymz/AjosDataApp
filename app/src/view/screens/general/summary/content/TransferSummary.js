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
export const TransferSummary = ({details}) => {
  let state = details?.state;

  if (state == 'processed') {
    state = 'successful';
  } else if (state == 'declined') {
    state = 'failed';
  }
  const dataList = [
    {
      title: `@${details?.metaInfo?.receiver}`,
      des: 'Username',
      right: (
        <View style={{...style.iconCon}}>
          <MyIcons.UserGreen size={15} />
        </View>
      ),
    },
    {
      title: details?.metaInfo?.account_name,
      des: 'User’s full name',
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
      title: details?.metaInfo?.description,
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
