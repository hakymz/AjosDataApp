import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import store from '../../../redux/store';
import {updatePopupModal} from '../../../redux/slices';
import {useDispatch, useSelector} from 'react-redux';
import {s} from 'react-native-size-matters';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {useLayouts} from '../../../hooks';

import {KeyboardAvoidingViewWrapper, Text} from '../general';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';

let backHandler;
const show = ({
  component,
  height = 350,
  title = '',
  onClose = () => {},
  hideCloseBtn,
  showConfetti,
}) => {
  let Component = null;
  let props = {};

  // If user passed a JSX element (<NoshV2 ... />)
  if (React.isValidElement(component)) {
    Component = component.type; // extract the component type (e.g. NoshV2)
    props = component.props; // extract its props
  }
  // If user passed a component reference (NoshV2)
  else if (typeof component === 'function') {
    Component = component;
  }

  store.dispatch(
    updatePopupModal({
      visible: true,
      hideModal: false,
      component: Component, // just the function reference
      props, // plain object
      height,
      title,
      onClose, // ⚠️ still non-serializable, better pass key instead
      hideCloseBtn,
      showConfetti,
    }),
  );
};
const hide = (visible = false) => {
  store.dispatch(updatePopupModal({hideModal: true, visible: visible}));
};

const Modal = () => {
  const {
    visible,
    hideModal,
    // component = null,
    height,
    title,
    onClose = () => {},
    hideCloseBtn = false,
    showConfetti = false,
    component: Component,
    props = {},
  } = useSelector(state => state.popupModal);
  const {bottom} = useSafeAreaInsets();

  const animationRef = React.useRef();

  const [state, setState] = React.useState({showConfetti: false});

  const dispatch = useDispatch();
  const [showModal, setShowModal] = React.useState(false);
  const {width} = useWindowDimensions();

  const aniValue = useSharedValue(0);
  React.useEffect(() => {
    if (showModal) {
      openModal();
    }
  }, [showModal]);

  React.useEffect(() => {
    if (visible == true) {
      setShowModal(true);
    }

    if (visible) {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!hideCloseBtn) {
          close();
        }
        return true;
      });
    } else {
      backHandler?.remove?.();
    }
    return () => {};
  }, [visible]);

  React.useEffect(() => {
    if (hideModal) {
      close();
    }
  }, [hideModal]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: aniValue?.value}],
    };
  });
  const close = () => {
    aniValue.value = withTiming(0, {
      duration: 200,
    });

    setTimeout(() => {
      dispatch(updatePopupModal({visible: false, hideModal: true}));
      setShowModal(false);
      setState(prevState => ({...prevState, showConfetti: false}));
      animationRef.current?.reset?.();
    }, 300);
  };

  const openModal = () => {
    if (showModal) {
      aniValue.value = withTiming(1, {
        duration: 200,
      });
    }
  };

  React.useEffect(() => {
    if (visible && showConfetti) {
      setState(prevState => ({...prevState, showConfetti: true}));
      setTimeout(() => {
        animationRef.current?.play?.();
      }, 10);
    }
  }, [visible]);

  return (
    showModal && (
      <View style={{...styles.container}}>
        <KeyboardAvoidingViewWrapper
          contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
          <Animated.View
            style={[
              {
                borderRadius: 24,
                width: width - 50,
                maxHeight: '80%',
              },
              animatedStyle,
            ]}>
            <View
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.white,
                ...styles.modal,
                paddingHorizontal: 16,
                borderWidth: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: !title ? 'flex-end' : 'space-between',
                }}>
                {title && (
                  <Text medium size={20}>
                    {title}
                  </Text>
                )}
              </View>

              {Component ? <Component {...props} /> : null}
            </View>
          </Animated.View>
        </KeyboardAvoidingViewWrapper>
      </View>
    )
  );
};

export const PopupModal = {
  Modal,
  show,
  hide,
};

const styles = StyleSheet.create({
  modal: {
    paddingBottom: 30,
    paddingVertical: 16,
    minHeight: 200,
    borderRadius: 16,
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
});
