import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../../../conts';
import {useUser} from '../../../hooks';
import {Text} from '../../components/general';

import {Image} from '../../components/general/image';

import onboardingScreens from '../../../conts/onboardingScreens';

export const OnboardingScreen = ({navigation}) => {
  const {updateUserData} = useUser();
  const [state, setState] = React.useState({
    indicatorIndex: 0,
  });

  const setAppIsOpened = async () => {
    updateUserData({appHasBeenOpened: true});
    navigation.navigate('SignUpScreen');
  };
  const goNextOrSkip = () => {
    if (state.indicatorIndex < 2) {
      setState(prevState => ({
        ...prevState,
        indicatorIndex: prevState.indicatorIndex + 1,
      }));
    } else {
      setAppIsOpened();
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{minHeight: '100%'}}>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
          }}>
          <View
            style={{
              overflow: 'hidden',
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 20,
            }}>
            <Text md>
              {state?.indicatorIndex + 1}/{onboardingScreens.length}
            </Text>
            {state.indicatorIndex < 2 && (
              <Text
                onPress={() => {
                  setAppIsOpened();
                }}
                style={{textDecorationLine: 'underline'}}
                md>
                SKIP
              </Text>
            )}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{height: 280, width: 280}}
              source={onboardingScreens[state.indicatorIndex]?.image}
            />
          </View>
          <View style={{marginTop: 20}}>
            <Text textAlign={'center'} bd size={40}>
              {onboardingScreens[state.indicatorIndex]?.title}
            </Text>

            <Text style={{marginTop: 30}} textAlign={'center'} size={18}>
              {onboardingScreens[state.indicatorIndex]?.message}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
            }}>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 40,
                marginTop: 20,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  goNextOrSkip();
                }}
                style={{
                  height: 94,
                  width: 94,
                  backgroundColor: COLORS.primary,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#820300',
                  shadowOpacity: 0.5,
                  shadowRadius: 15,
                  elevation: 15,
                  shadowOffset: {width: 10, height: 10},
                }}>
                <Text md size={14} color={COLORS.white}>
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
