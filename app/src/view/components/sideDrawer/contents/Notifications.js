import {FlatList, ScrollView, View} from 'react-native';
import React from 'react';
import {Icons, Text} from '../../general';
import {COLORS, FONTS} from '../../../../conts';
import {s} from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import {Image} from '../../general/image';
import {useLayouts, useWallet} from '../../../../hooks';
import moment from 'moment';

const formatDate = (date, lastDate) => {
  const lastDateNow = lastDate;
  const checkDate = moment(date).format('D');
  let newDate = null;
  if (checkDate != moment(lastDateNow).format('D')) {
    newDate = `${moment(date).format('dddd')}, ${moment(date).format(
      'D',
    )} ${moment(date).format('MMM')}`;
  }
  return newDate;
};

const List = ({data, lastDate = null}) => {
  const date = data?.created_at;
  const formatDated = formatDate(date, lastDate);
  const category = data?.category?.toLowerCase?.();
  let image = null;
  let imageSize = 47;

  if (category == 'gift card' || category == 'bill payment') {
    imageSize = 47;
  }

  if (category == 'credit card') {
    image = <Icons.TopUpBlue />;
  } else if (category == 'user-user transfer') {
    image = (
      <Image
        style={{
          height: s(imageSize),
          width: s(imageSize),
          resizeMode: 'contain',
          borderRadius: 100,
        }}
        source={require('../../../../assets/images/others/onemUser.png')}
      />
    );
  } else {
    image = (
      <Image
        style={{
          height: s(imageSize),
          width: s(imageSize),
          resizeMode: 'contain',
          borderRadius: 100,
        }}
        source={{uri: data?.imageUrl}}
      />
    );
  }

  return (
    <View>
      {formatDated && (
        <Text
          lineHeight={16.42}
          fontType={FONTS.FREDOKA}
          size={16}
          color={COLORS.lightBlue}
          style={{paddingTop: 20, paddingBottom: 10}}>
          {formatDated}
        </Text>
      )}

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          marginBottom: 10,
          alignItems: 'center',
        }}>
        <View
          style={{
            height: s(47),
            width: s(47),
            backgroundColor: COLORS.white,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {image}
        </View>

        <Text
          regular
          color={COLORS.primary}
          size={14}
          numberOfLines={10}
          style={{flex: 1, marginLeft: 15}}>
          {data?.description}
        </Text>
      </View>
    </View>
  );
};

export const Notifications = () => {
  const {getNotification, notifications} = useWallet();
  const {minHeight} = useLayouts();
  React.useEffect(() => {
    getNotification();
  }, []);
  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 50, minHeight: minHeight - 180}}
      showsVerticalScrollIndicator={false}>
      {(notifications?.length == 0 || !notifications) && (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <LottieView
            resizeMode="cover"
            style={{
              height: s(196),
            }}
            autoPlay
            loop={true}
            source={require('../../../../assets/lottieFiles/others/notification.json')}
          />
        </View>
      )}
      <FlatList
        data={notifications?.filter((_, index) => index <= 50)}
        renderItem={({item, index}) => (
          <List lastDate={notifications[index - 1]?.created_at} data={item} />
        )}
      />
    </ScrollView>
  );
};
