import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../../../conts';
import {Text} from '../../general';
export const TermsAndCondition = () => {
  return (
    <View style={{paddingHorizontal: 30}}>
      <Text
        style={{marginBottom: 30}}
        bold
        color={COLORS.primary}
        lineHeight={25}
        size={20}>
        Our Terms of Use
      </Text>
      <Text color={'#666766'} lineHeight={18}>
        Contrary to popular belief, Lorem Ipsum is not simply random text. It
        has roots in a piece of classical Latin literature from 45 BC, making it
        over 2000 years old. Richard McClintock, a Latin professor at
        Hampden-Sydney College in Virginia, looked up one of the more obscure
        Latin words, consectetur, from a Lorem Ipsum passage, and going through
        the cites of the word in classical literature, discovered the
        undoubtable source.
      </Text>
    </View>
  );
};
