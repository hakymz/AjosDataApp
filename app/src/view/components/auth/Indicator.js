import React from 'react';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {COLORS} from '../../../conts';
const animateDuration = 500;

export const Indicator = ({indicatorIndex}) => {
  const width = useSharedValue('25%');
  React.useEffect(() => {
    if (indicatorIndex > 0) {
      const indicatorWidth =
        Math.round((indicatorIndex + 1) * 25).toString() + '%';
      width.value = withTiming(indicatorWidth, {
        duration: animateDuration,
      });
    }
  }, [indicatorIndex]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: width.value,
    };
  });

  return (
    <View
      style={{
        height: 3,
        backgroundColor: '#E5E7EC',
        marginBottom: 40,
        marginHorizontal: 60,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
      <Animated.View
        style={[
          animatedStyles,
          {
            height: '100%',
            backgroundColor: COLORS.lightGreen,
          },
        ]}
      />
    </View>
  );
};
