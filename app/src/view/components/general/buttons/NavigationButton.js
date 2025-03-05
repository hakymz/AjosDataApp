import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
import {MyIcons} from '../others';
import {Text} from '../text';
export const NavigationButton = ({title, left, style, onPress, ...rest}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={onPress || navigation.goBack}
      style={{
        height: s(46),
        backgroundColor: COLORS.black,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        ...style,
      }}
      {...rest}>
      {left && (
        <MyIcons.ArrowGreen
          style={{transform: [{rotate: '180deg'}]}}
          size={16}
        />
      )}
      <Text size={14} semiBold color={COLORS.white}>
        {title}
      </Text>
      {!left && <MyIcons.ArrowGreen size={16} />}
    </TouchableOpacity>
  );
};
