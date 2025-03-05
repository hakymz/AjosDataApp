import {BlurView, VibrancyView} from '@react-native-community/blur';
import React from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {COLORS, GENERAL} from '../../../conts';
import {updateDrawer} from '../../../redux/slices';
import {CircleButton, Icons, NavigationButton} from '../general';
import store from '../../../redux/store';
let backHandler;

const show = (side, component) => {
  store.dispatch(updateDrawer({visible: true, side, component}));
};

const hide = (side, component) => {
  store.dispatch(updateDrawer({visible: false, side, component}));
};

const Header = ({}) => {
  const {visible, component, side} = useSelector(state => state.sideDrawer);

  return (
    <View
      style={{
        marginTop:
          GENERAL.platform == 'ios' ? GENERAL.statusBarHeight + 20 : 20,
        flexDirection: 'row',
        justifyContent: side == 'right' ? 'flex-end' : 'flex-start',
        paddingBottom: 20,
      }}>
      <NavigationButton
        onPress={() => hide(side, component)}
        title={'Back'}
        left
        style={{width: 100}}
      />
    </View>
  );
};
export const Drawer = React.memo(() => {
  const [showSideBar, setShowSideBar] = React.useState(false);
  const {visible, component, side} = useSelector(state => state.sideDrawer);
  const drawerLeftPosition = useSharedValue(-500);
  const drawerRightPosition = useSharedValue(-500);
  const drawerLeftPositionAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: drawerLeftPosition.value,
    };
  });
  const drawerRightPositionAnimatedStyle = useAnimatedStyle(() => {
    return {
      right: drawerRightPosition.value,
    };
  });
  const toggleDrawer = () => {
    if (visible) {
      setShowSideBar(visible);
      setTimeout(() => {
        if (side == 'left') {
          drawerLeftPosition.value = withTiming(0, {
            duration: 300,
          });
        } else if (side == 'right') {
          drawerRightPosition.value = withTiming(0, {
            duration: 300,
          });
        }
      }, 50);
    } else {
      if (side == 'left') {
        drawerLeftPosition.value = withTiming(-500, {
          duration: 300,
        });
      } else if (side == 'right') {
        drawerRightPosition.value = withTiming(-500, {
          duration: 300,
        });
      }
      setTimeout(() => {
        setShowSideBar(false);
      }, 300);
    }
  };

  React.useEffect(() => {
    toggleDrawer();
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        hide(side, component);
        return true;
      });
    } else {
      backHandler?.remove?.();
    }
  }, [visible]);

  return (
    <>
      {showSideBar && (
        <View style={{...style.container, height: '100%'}}>
          {GENERAL.platform == 'ios' ? (
            <VibrancyView
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 0,
              }}
              blurAmount={5}
              blurType="extraDark"
            />
          ) : (
            <BlurView
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                zIndex: 0,
              }}
              blurAmount={5}
              blurType="extraDark"
            />
          )}
          {/* For left content  */}

          {side == 'left' && (
            <Animated.View
              style={[
                {
                  ...style.content,
                  marginRight: 40,
                },
                drawerLeftPositionAnimatedStyle,
              ]}>
              {showSideBar && <Header />}
              {component}
            </Animated.View>
          )}

          {/* For right content */}

          {side == 'right' && (
            <Animated.View
              style={[
                {
                  ...style.content,
                  right: 0,
                  marginLeft: 40,
                },
                drawerRightPositionAnimatedStyle,
              ]}>
              {showSideBar && <Header />}

              {component}
            </Animated.View>
          )}
        </View>
      )}
    </>
  );
});

export const SideDrawer = {
  Drawer,
  show,
  hide,
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    bottom: 0,
  },
  content: {
    paddingHorizontal: 20,
    height: '100%',
    backgroundColor: '#F8F8F8',
  },
});
