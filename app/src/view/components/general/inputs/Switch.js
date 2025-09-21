import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {s} from 'react-native-size-matters';
import {COLORS} from '../../../../conts';
const width = s(40);
export const Switch = ({
  enabled,
  onValueChange = () => {},
  onPress,
  backgroundColors = [COLORS.primary, 'rgba(150, 150, 150, 1)'],
}) => {
  const thumbPostion = useSharedValue(0);
  // const backgroundColor = useSharedValue('rgb(183, 198, 226)');
  const backgroundColorProgress = useSharedValue(0);

  // const [enabled, setEnabled] = React.useState(false);
  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: thumbPostion.value,
    };
  });
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      backgroundColorProgress.value,
      [1, 0],
      backgroundColors,
    );
    return {
      backgroundColor,
    };
  });

  const toggleSwitch = () => {
    if (enabled) {
      thumbPostion.value = withTiming(width - 29, {
        duration: 300,
      });
      backgroundColorProgress.value = withTiming(1, {
        duration: 300,
      });
    } else {
      thumbPostion.value = withTiming(0, {
        duration: 300,
      });
      backgroundColorProgress.value = withTiming(0, {
        duration: 300,
      });
    }
  };

  React.useEffect(() => {
    toggleSwitch();
    onValueChange(enabled);
  }, [enabled]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Animated.View style={[style.switch, backgroundAnimatedStyle]}>
        <Animated.View style={[style.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  switch: {
    height: 24,
    width,
    borderRadius: 40,
    justifyContent: 'center',
    paddingHorizontal: 5,
    backgroundColor: COLORS.primary,
  },
  thumb: {
    height: 18,
    width: 18,
    backgroundColor: COLORS.white,
    borderRadius: 18,
  },
});
