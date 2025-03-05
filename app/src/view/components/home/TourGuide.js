import React from 'react';
import {Image, Modal, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {BottomSheets, Text} from '../general';
import {COLORS} from '../../../conts';
// import Intercom from '@intercom/intercom-react-native';
import {useUser} from '../../../hooks';
import {Biometric, CreatePin} from '../bottomSheetModal/contents';

const Step1 = () => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{flex: 1, alignItems: 'center', top: top + 50}}>
      <Image
        style={{height: 462, width: 357}}
        source={require('../../../assets/images/others/tourStep1.png')}
      />
    </View>
  );
};

const Step2 = () => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{flex: 1, alignItems: 'center', top: top + 50}}>
      <Image
        style={{height: 457, width: 341}}
        source={require('../../../assets/images/others/tourStep2.png')}
      />
    </View>
  );
};

const Step3 = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{height: 200, width: 400, top: -50}}
        source={require('../../../assets/images/others/tourStep3.png')}
      />
    </View>
  );
};

const Step4 = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <Image
        style={{height: 534, width: 391, bottom: -30, position: 'absolute'}}
        source={require('../../../assets/images/others/tourStep4.png')}
      />
    </View>
  );
};

const RenderSteps = ({step}) => {
  if (step == 1) {
    return <Step1 />;
  }
  if (step == 2) {
    return <Step2 />;
  }
  if (step == 3) {
    return <Step3 />;
  }
  if (step == 4) {
    return <Step4 />;
  }
};
export const TourGuide = () => {
  const {tour, updateUserData, data, settings} = useUser();
  const [state, setState] = React.useState({step: 1});
  const {bottom} = useSafeAreaInsets();

  React.useEffect(() => {
    if (!tour) {
      setTimeout(() => {
        Intercom.setLauncherVisibility('GONE');
      }, 500);
    }
  }, []);

  return (
    !tour && (
      <Modal transparent>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.9)'}}>
          <RenderSteps step={state?.step} />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (state?.step < 4) {
              setState(prevState => ({
                ...prevState,
                step: prevState?.step + 1,
              }));
            } else {
              updateUserData({tour: true});
              if (!data?.user?.setTransactionPin) {
                BottomSheets.show({
                  component: <CreatePin />,
                  customSnapPoints: [600, 600],
                  canClose: false,
                });
              } else if (!settings?.biometric) {
                BottomSheets.show({
                  component: <Biometric />,
                  customSnapPoints: [600, 600],
                });
              }
            }
          }}
          style={{
            height: 80,
            width: 80,
            backgroundColor: COLORS.primary,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#820300',
            shadowOpacity: 0.5,
            shadowRadius: 15,
            elevation: 15,
            shadowOffset: {width: 10, height: 10},
            position: 'absolute',
            zIndex: 10,
            right: 24,
            bottom: bottom + 24,
          }}>
          <Text md size={14} color={COLORS.white}>
            NEXT
          </Text>
        </TouchableOpacity>
      </Modal>
    )
  );
};
