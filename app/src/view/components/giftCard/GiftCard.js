import React from 'react';
import {View, useWindowDimensions, Pressable} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {Image} from '../general/image';
import {Text} from '../general';
import {useLayouts, useOrientation} from '../../../hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SvgUri, SvgCssUri} from 'react-native-svg';
import FastImage from 'react-native-fast-image';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
export const GiftCard = ({item, ...props}) => {
  const {screenOrientation} = useOrientation();
  const {top, left} = useSafeAreaInsets();

  const {width} = useWindowDimensions();
  const widthCard =
    screenOrientation == GENERAL.landScape
      ? (width - left * 2) * 0.25 - 25
      : width * 0.3 - 10;

  const image = item?.logoUrls?.[0] || item?.avatar;

  return (
    <TouchableOpacity
      style={{
        minHeight: 102,
        height: widthCard,
        width: widthCard,
        backgroundColor: '#F8F8F9',
        marginBottom: 10,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
      }}
      {...props}>
      <>
        <View>
          {image.includes?.('.svg') ? (
            <SvgUri height={34} width={34} uri={image} />
          ) : (
            <Image
              resizeMode={FastImage.resizeMode.cover}
              style={{height: 34, width: 34, borderRadius: 100}}
              source={{uri: item?.logoUrls?.[0] || item?.avatar}}
            />
          )}
        </View>

        <Text
          style={{marginTop: 10}}
          numberOfLines={2}
          size={12}
          semiBold
          color={'#002444'}>
          {item?.productName || item?.name}
        </Text>
      </>
    </TouchableOpacity>
  );
};
