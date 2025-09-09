import React from 'react';
import {
  View,
  useWindowDimensions,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Image,
  Keyboard,
} from 'react-native';
import {CloseButton, Icons, Text} from '../general';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {COLORS, FONTS, GENERAL} from '../../../conts';
import {s} from 'react-native-size-matters';
import {BlurView, VibrancyView} from '@react-native-community/blur';
import {updateBottomSheet} from '../../../redux/slices';
import {useSelector} from 'react-redux';
let prevComponent = null;
import store from '../../../redux/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import Intercom from '@intercom/intercom-react-native';
import {Modalize} from 'react-native-modalize';

const show = ({
  component,
  backgroundColor,
  customSnapPoints,
  scrollview = true,
  canClose = true,
  showCloseBtn = true,
  disableScrollIfPossible = true,
}) => {
  prevComponent = component;
  store.dispatch(
    updateBottomSheet({
      visible: true,
      component,
      backgroundColor,
      style,
      customSnapPoints,
      scrollview,
      canClose,
      disableScrollIfPossible,
      showCloseBtn,
    }),
  );
};

const update = ({backgroundColor, customSnapPoints}) => {
  store.dispatch(
    updateBottomSheet({
      visible: true,
      backgroundColor,
      style,
      customSnapPoints,
      component: prevComponent,
      canClose,
    }),
  );
};

const hide = () => {
  store.dispatch(updateBottomSheet({visible: false}));
};

const BottomSheetContent = ({
  bottomSheetRef,
  closeOnBackButtonPress,
  snapPoints,
  handleSheetChanges,
  modalHeight,
}) => {
  const {
    component,
    backgroundColor,
    containerStyle,
    scrollview = true,
    canClose = true,
    disableScrollIfPossible = true,
    showCloseBtn,
  } = useSelector(state => state.bottomSheet);

  React.useEffect(() => {
    bottomSheetRef?.current?.open();
  }, []);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {});
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetRef?.current?.collapse?.();
    });

    // Intercom.setLauncherVisibility('GONE');

    return () => {
      // Intercom.setLauncherVisibility('VISIBLE');

      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Modalize
      modalStyle={{borderTopRightRadius: 30, borderTopLeftRadius: 30}}
      disableScrollIfPossible={disableScrollIfPossible}
      adjustToContentHeight={snapPoints?.[1] ? false : true}
      avoidKeyboardLikeIOS
      keyboardAvoidingBehavior={
        GENERAL.platform == 'android' ? null : 'padding'
      }
      // modalHeight={500}
      withHandle={false}
      HeaderComponent={
        <View
          style={{
            height: 40,
            backgroundColor: COLORS.white,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 5.5,
              width: 42,
              backgroundColor: '#E9F1FF',
              borderRadius: 6,
              marginTop: 15,
            }}></View>
        </View>
      }
      onClosed={hide}
      modalHeight={snapPoints?.[1] || undefined}
      snapPoint={snapPoints?.[0]}
      ref={bottomSheetRef}>
      <View style={{backgroundColor: 'white', borderTopRightRadius: 40}}>
        <View
          style={{
            marginTop: 0,
            backgroundColor: backgroundColor || COLORS.white,
            paddingBottom: 40,
            paddingTop: 20,
            ...containerStyle,
          }}>
          {component}

          {showCloseBtn && (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0,
              }}>
              <CloseButton
                onPress={() => {
                  hide();
                }}
              />
            </View>
          )}
        </View>
      </View>
    </Modalize>
  );
};

let backHandler;
const BottomSheetsModal = ({}) => {
  const {visible, customSnapPoints, canClose, showCloseBtn} = useSelector(
    state => state.bottomSheet,
  );
  const {height, width} = useWindowDimensions();
  const {top} = useSafeAreaInsets();
  const bottomSheetRef = React.useRef(null);

  const handleSheetChanges = index => {
    if (index == -1) {
      hide();
    }
  };

  const closeOnBackButtonPress = () => {
    bottomSheetRef?.current?.close?.();
    return true;
  };

  // variables
  const snapPoints = React.useMemo(() => {
    let currentSnapPoints = null;
    if (typeof customSnapPoints?.[0] == 'string') {
      let snapPoint1 = customSnapPoints?.[0];
      let snapPoint2 = customSnapPoints?.[1];

      snapPoint1 = snapPoint1?.split('%')?.[0];
      snapPoint1 = (snapPoint1 * height) / 100;

      snapPoint2 = snapPoint2?.split('%')?.[0];
      snapPoint2 = (snapPoint2 * height) / 100;

      currentSnapPoints = [snapPoint1, snapPoint2];
    } else {
      currentSnapPoints = customSnapPoints;
    }
    return currentSnapPoints;
  }, [customSnapPoints]);

  React.useEffect(() => {
    if (!visible) {
      bottomSheetRef?.current?.collapse?.();
    } else {
    }
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        closeOnBackButtonPress,
      );
    } else {
      backHandler?.remove?.();
    }
    return () => {
      // backHandler.remove();
    };
  }, [visible]);

  return (
    <View style={[style.container, {height: !visible ? 0 : height, width}]}>
      {canClose && (
        <TouchableOpacity
          onPress={() => {
            closeOnBackButtonPress();
          }}
          style={{position: 'absolute', top: top + 20, right: 20, zIndex: 20}}>
          <Icons.CloseCircle size={25} />
        </TouchableOpacity>
      )}

      {visible && (
        <View style={{flex: 1}}>
          <BottomSheetContent
            closeOnBackButtonPress={closeOnBackButtonPress}
            bottomSheetRef={bottomSheetRef}
            snapPoints={snapPoints}
            handleSheetChanges={handleSheetChanges}
          />
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
    height: '100%',
    zIndex: 10,
    bottom: 0,
  },
});

export const BottomSheets = {Modal: BottomSheetsModal, show, hide, update};
