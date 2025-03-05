import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {SectionList} from '../../../../components/lists';
import {Image} from 'react-native-svg';
import {COLORS, GENERAL} from '../../../../../conts';
import {
  CopyIcon,
  MyIcons,
  StatusComponent,
  Text,
} from '../../../../components/general';
import {formatAmount} from '../../../../../helper';
import {s} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import {useUser} from '../../../../../hooks';
const getStatusColor = status => {
  if (status == 'successful' || status == 'processed') {
    return COLORS.primary;
  }
  if (status == 'pending') {
    return '#6F6F6F';
  }
  if (status == 'failed' || status == 'declined') {
    return '#FF0000';
  }
};

const ImageButton = ({number = 1, item, onPress}) => {
  return (
    <TouchableOpacity
      style={{paddingRight: 5}}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={{
          height: s(41),
          width: s(41),
          backgroundColor: '#D5EAE0',
          borderRadius: 50,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,
          overflow: 'visible',
        }}>
        <Text color={COLORS.primary} semiBold size={14}>
          {number}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const PaypalSummary = ({details}) => {
  const navigation = useNavigation();
  const {data} = useUser();
  let state = details?.state;

  if (state == 'processed') {
    state = 'successful';
  } else if (state == 'declined') {
    state = 'failed';
  }

  let pinCode = [];
  if (
    Array.isArray(details?.metaInfo?.pinCode) &&
    details?.metaInfo?.pinCode?.length > 0
  ) {
    pinCode = details?.metaInfo?.pinCode;
  }

  const dataList = [
    {
      title: details?.metaInfo?.type,
      des: 'Payment Type',
      right: <View style={{...style.iconCon}}>{details?.icon}</View>,
    },
    {
      title: data?.user?.email,
      des: 'Sender',
    },

    {
      title: `$${details?.amount}`,
      des: 'Amount',
      right: (
        <Text semiBold lineHeight={24} size={20}>
          {GENERAL.nairaSign}
          {details?.metaInfo?.purchaseStatus == 'buy'
            ? formatAmount(details?.amount)
            : formatAmount(details?.amount)}
        </Text>
      ),
    },
    details?.type?.type && {
      title: details?.type?.type,
      des: details?.type?.name,
    },
    {
      title: `${details?.transactionId}`,
      des: 'Transaction ID',
      right: <CopyIcon text={details?.transactionId} />,
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
