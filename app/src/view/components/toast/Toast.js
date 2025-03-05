import React from 'react';
import {StyleSheet, Vibration} from 'react-native';
import {Text} from '../general/text';
import {COLORS, FONTS} from '../../../conts';

import {updateToast} from '../../../redux/slices';
import {useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {s} from 'react-native-size-matters';
import {MotiView} from 'moti';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import store from '../../../redux/store';
const show = (type, message) => {
  store.dispatch(updateToast({visible: true, type, message}));
};

const hide = (type, message) => {
  store.dispatch(updateToast({visible: false, type, message}));
};

const Main = () => {
  const typeRef = React.useRef();
  const timeOutRef = React.useRef();
  const {visible, type, message} = useSelector(state => state.toast);
  const [showToast, setShowToast] = React.useState(visible);
  const bottom = useSharedValue(-500);

  const insets = useSafeAreaInsets();
  const aniStyle = useAnimatedStyle(() => {
    return {
      bottom: bottom?.value,
    };
  });
  React.useEffect(() => {
    clearTimeout(timeOutRef.current);
    if (visible) {
      open();
    } else {
      close();
    }
  }, [visible]);
  const close = () => {
    bottom.value = withTiming(-500, {
      duration: 300,
    });
    timeOutRef.current = setTimeout(() => setShowToast(false), 500);
  };
  const open = () => {
    typeRef.current = type;
    setShowToast(true);
    timeOutRef.current = setTimeout(() => {
      bottom.value = withTiming(insets.bottom, {
        duration: 300,
      });
      Vibration.vibrate(200);

      timeOutRef.current = setTimeout(() => hide(type, message), 4000);
    }, 100);
  };
  return (
    showToast && (
      <Animated.View
        style={[
          styles.toast,
          {backgroundColor: type == 'error' ? COLORS.red : COLORS.green},
          aniStyle,
        ]}>
        <Text medium color={COLORS.white} fontType={FONTS.FREDOKA}>
          {message}
        </Text>
      </Animated.View>
    )
  );
};

const Toast = {
  Main,
  show,
  hide,
};

const styles = StyleSheet.create({
  toast: {
    minHeight: s(40),
    width: '100%',
    position: 'absolute',
    zIndex: 1000,
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
  },
});

export default Toast;
