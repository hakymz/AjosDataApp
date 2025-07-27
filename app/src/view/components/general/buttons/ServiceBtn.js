import React from 'react';
import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {Image} from '../image';
import {Text} from '../text';
import {COLORS} from '../../../../conts';
export const ServiceBtn = ({
  item,
  name,
  image,
  selected,
  onPress = () => {},
}) => {
  const {width} = useWindowDimensions();
  const imageSize = width / 3 - 22;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 20,
        width: imageSize,
        borderRadius: 16,
        overflow: 'hidden',
        height: 118,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={typeof image == 'number' ? image : {uri: image}}
        style={{
          width: 50,
          height: 50,
          borderRadius: 100,
        }}
      />

      <Text
        numberOfLines={2}
        size={12}
        color={'#303437'}
        textAlign={'center'}
        bold
        style={{
          marginTop: 10,
          paddingHorizontal: 10,
        }}>
        {item?.name || item?.product || name}
      </Text>
    </TouchableOpacity>
  );
};
