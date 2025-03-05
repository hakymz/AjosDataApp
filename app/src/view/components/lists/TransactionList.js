import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {s} from 'react-native-size-matters';
import {COIN_LIST, COLORS, FONTS} from '../../../conts';
import {Icons, Text} from '../general';
import {formatAmount} from '../../../helper';
import {SideDrawer} from '../sideDrawer';
import {TransactionDetails} from '../sideDrawer/contents';
import moment from 'moment';
import {Image} from '../general/image';

const Logo = ({category, image}) => {
  let imageSize;
  if (
    category == 'bank transfer' ||
    category == 'withdrawal' ||
    category == 'user-user transfer'
  ) {
    imageSize = s(28);
  } else {
    imageSize = '100%';
  }

  let getImage;

  if (category == 'credit card' || category == 'wallet') {
    getImage = <Icons.TopUpBlue size={33} />;
  } else if (category == 'user-user transfer') {
    getImage = (
      <Image
        style={{
          height: s(50),
          width: s(30),
          resizeMode: 'contain',
          borderRadius: 100,
        }}
        source={require('../../../assets/images/others/onemUser.png')}
      />
    );
  } else {
    getImage = (
      <Image
        style={{
          height: imageSize,
          width: imageSize,
          resizeMode: 'contain',
          borderRadius: imageSize == '100%' ? 100 : null,
        }}
        source={{uri: image || null}}
      />
    );
  }

  return category == 'crypto' ||
    category == 'gift card' ||
    category == 'Wallet' ? (
    <Image
      style={{
        height: s(63),
        width: s(63),
        resizeMode: 'contain',
      }}
      source={{uri: image || null}}
    />
  ) : (
    <View
      style={{
        height: s(53),
        width: s(53),
        backgroundColor: COLORS.white,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#DCE1FA',
        overflow: 'hidden',
      }}>
      {getImage}
    </View>
  );
};

const formatDate = (date, lastDate) => {
  const checkDate = moment(date).format('D');
  let newDate = null;
  if (checkDate != moment(lastDate).format('D')) {
    newDate = moment(date).format('dddd, D MMM YYYY');
    lastDate = date;
  }

  return newDate;
};

export const TransactionList = ({item, showDate = true, lastDate = null}) => {
  const date = item?.created_at;

  const formatDated = formatDate(date, lastDate);

  const type = item?.actualCategory?.toLowerCase();

  const amountColor = () => {
    if (
      item?.category?.toLowerCase?.() == 'crypto' ||
      item?.category?.toLowerCase?.() == 'bill payment'
    ) {
      return COLORS.primary;
    }
    if (
      item?.category?.toLowerCase?.() == 'gift card' &&
      item?.status == 'debit'
    ) {
      return '#989898';
    }
    if (item?.status == 'debit') {
      return COLORS.darkRed;
    }
    if (item?.status == 'credit') {
      return COLORS.green;
    }
  };

  const textColor = () => {
    if (
      item?.category?.toLowerCase?.() == 'crypto' ||
      item?.category?.toLowerCase?.() == 'bill payment'
    ) {
      return COLORS.primary;
    }

    if (
      item?.category?.toLowerCase?.() == 'gift card' &&
      item?.status == 'debit'
    ) {
      return '#989898';
    }
    if (item?.status == 'debit') {
      return COLORS.darkRed;
    }
    if (item?.status == 'credit') {
      return COLORS.green;
    }
  };

  const backgroundColor = () => {
    if (item?.category == 'Crypto') {
      const coinColor = COIN_LIST.filter(coin => {
        if (coin.unit?.toLowerCase() == type?.toLowerCase()) {
          return coin;
        }
      })?.[0]?.backgroundColor;

      return coinColor || '#F3F7FF';
    } else {
      return '#F3F7FF';
    }
  };

  return (
    <View>
      {formatDated && showDate && (
        <Text
          color={'#6B7ED6'}
          style={{paddingHorizontal: 10, marginBottom: 10, marginTop: 20}}>
          {formatDated}
        </Text>
      )}

      <TouchableOpacity
        onPress={() =>
          SideDrawer.show('right', <TransactionDetails data={item} />)
        }
        activeOpacity={0.7}
        style={{
          height: s(95),
          backgroundColor: backgroundColor(),
          marginBottom: 10,
          borderRadius: 15,
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Logo
          category={item?.category?.toLowerCase?.()}
          image={item.imageUrl}
        />
        <View
          style={{
            paddingLeft: 10,
            flex: 1,
            paddingRight: 10,
          }}>
          <Text medium color={COLORS.primary} numberOfLines={1}>
            {item?.actualCategory || item?.category}
          </Text>

          <Text
            color={textColor()}
            numberOfLines={
              item?.category?.toLowerCase?.() == 'gift card' ? 2 : 1
            }>
            {item?.shortDescription}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '30%',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <View style={{height: s(24), top: s(4)}}>
            <Icons.Naira color={amountColor()} height={s(24)} width={s(12)} />
          </View>

          <Text
            size={16}
            numberOfLines={1}
            color={amountColor()}
            style={{textAlign: 'right', paddingLeft: 1}}
            fontType={FONTS.FREDOKA}>
            {formatAmount(item?.amount)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
