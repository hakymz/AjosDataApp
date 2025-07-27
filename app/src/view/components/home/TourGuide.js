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
    <View
      style={{flex: 1, alignItems: 'flex-end', top: top + 20, marginRight: 20}}>
      <Image
        style={{height: 405, width: 299}}
        source={require('../../../assets/images/others/tourStep1.png')}
      />
    </View>
  );
};

const Step2 = () => {
  const {top} = useSafeAreaInsets();
  return (
    <View style={{flex: 1, alignItems: 'center', top: top + 20}}>
      <Image
        style={{height: 565, width: 344}}
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
        style={{height: 300, width: 399}}
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
        style={{height: 347, width: 327, bottom: 120, position: 'absolute'}}
        source={require('../../../assets/images/others/tourStep4.png')}
      />
    </View>
  );
};

const Step5 = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
      }}>
      <Image
        style={{height: 449, width: 327, bottom: 50, position: 'absolute'}}
        source={require('../../../assets/images/others/tourStep5.png')}
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
  if (step == 5) {
    return <Step5 />;
  }
};
export const TourGuide = () => {
  const {tour, updateUserData, data, settings} = useUser();
  const [state, setState] = React.useState({step: 1});
  const {bottom} = useSafeAreaInsets();

  React.useEffect(() => {
    // if (!tour) {
    //   setTimeout(() => {
    //     Intercom.setLauncherVisibility('GONE');
    //   }, 500);
    // }
  }, []);

  return (
    !tour && (
      <Modal transparent>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.9)'}}>
          <RenderSteps step={state?.step} />
        </View>

        <TouchableOpacity
          onPress={() => {
            if (state?.step < 5) {
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
          style={{}}>
          <Image
            style={{
              width: 129,
              height: 191,
              right: -5,
              position: 'absolute',
              bottom: bottom - 30,
            }}
            source={require('../../../assets/images/onboarding/nextButton.png')}
          />
        </TouchableOpacity>
      </Modal>
    )
  );
};
