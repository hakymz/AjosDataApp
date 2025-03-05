import React, {useRef} from 'react';
import {Image, View} from 'react-native';
import {COLORS} from '../../../conts';
import {useSelector} from 'react-redux';
import {updatePreloader} from '../../../redux/slices/modals/loaderSlice';
import store from '../../../redux/store';
import LottieView from 'lottie-react-native';
import {s} from 'react-native-size-matters';
import {Text} from '../general';
import loader2 from '../../../assets/lottieFiles/others/splashScreen.json';
import {useLayouts} from '../../../hooks';
const Loader = () => {
  const {visible} = useSelector(state => state.loader);
  const {height, width} = useLayouts();

  const animationRef = React.useRef();
  // const [showContent, setShowContent] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      console.log(visible);
      setTimeout(() => {
        animationRef.current?.play?.();
      }, 10);
    }
  }, [visible]);

  return visible ? (
    <View
      style={{
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width,
        height,
      }}>
      <Image
        style={{width: 210, height: 94}}
        source={require('../../../assets/images/others/logoWhite.png')}
      />
    </View>
  ) : null;
};

const show = options => {
  store.dispatch(
    updatePreloader({
      visible: true,
    }),
  );
};
const update = options => {
  store.dispatch(
    updatePreloader({
      visible: true,
    }),
  );
};

const hide = () => {
  store.dispatch(updatePreloader({visible: false, message: ''}));
};
export const Preloader = {
  Loader,
  show,
  hide,
  update,
};
