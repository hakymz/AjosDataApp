import React from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {COLORS} from '../../../conts';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';

export const SplashScreen = ({hideSplashScreen}) => {
  const lottieRef = React.useRef();
  React.useEffect(() => {
    setTimeout(() => {
      lottieRef?.current?.play?.();
    }, 10);
  }, []);
  return (
    <SafeAreaView style={{...style.container, backgroundColor: COLORS.primary}}>
      <StatusBar backgroundColor={'#111718'} barStyle="light-content" />
      <View
        style={{
          backgroundColor: COLORS.primary,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          width: '100%',
          height: '100%',
        }}>
        <Image
          style={{width: 210, height: 94}}
          source={require('../../../assets/images/others/logoWhite.png')}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#111718',
    position: 'absolute',
    zIndex: 10,
  },
});
