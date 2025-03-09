import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {COLORS} from '../../../conts';
import {useUser} from '../../../hooks';
import {Text} from '../../components/general';

import {Image} from '../../components/general/image';

import onboardingScreens from '../../../conts/onboardingScreens';

export const OnboardingScreen = ({navigation}) => {
  const {width} = useWindowDimensions();
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
          }}>
          <FlatList
            data={onboardingScreens}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              const x = event?.nativeEvent?.contentOffset?.x;
              const currentIndex = Math.round(x / (width - 48));
              if (state.indicatorIndex != currentIndex) {
                setState(prevState => ({
                  ...prevState,
                  indicatorIndex: currentIndex,
                }));
              }
            }}
            renderItem={({item}) => (
              <View style={{width}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 50,
                  }}>
                  <Image
                    style={{height: 300, width: 300}}
                    source={item?.image}
                  />
                </View>
                <View style={{marginTop: 40, paddingHorizontal: 20}}>
                  <Text color={COLORS.primary} bold size={18}>
                    {item?.title}
                  </Text>

                  <Text style={{marginTop: 10}} size={18}>
                    {item?.message}
                  </Text>
                </View>
              </View>
            )}
          />

          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              top: 20,
            }}>
            {onboardingScreens?.map((_, index) => (
              <View
                style={{
                  height: 8,
                  width: index == state?.indicatorIndex ? 20 : 8,
                  backgroundColor:
                    index == state?.indicatorIndex
                      ? COLORS.primary
                      : '#3580FF36',
                  borderRadius: 10,
                  marginRight: 5,
                }}
              />
            ))}
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
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                onPress={() => {
                  setAppIsOpened();
                }}
                style={{marginLeft: 20}}
                medium
                color={'#002055'}>
                Skip
              </Text>
              <TouchableOpacity
                onPress={() => {
                  goNextOrSkip();
                }}
                style={{}}>
                <Image
                  style={{width: 129, height: 191, right: -5}}
                  source={require('../../../assets/images/onboarding/nextButton.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
