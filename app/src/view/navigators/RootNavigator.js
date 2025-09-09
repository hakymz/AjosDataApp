import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './stacks/AuthStack';
import {useUser} from '../../hooks';

import {createStackNavigator} from '@react-navigation/stack';
import {ErrorScreen, SplashScreen, SuccessScreen} from '../screens/general';
import {BottomSheets} from '../components/bottomSheetModal';
import MainStack from './stacks/MainStack';
import ModalContainer from '../components/modals/ModalContainer';
import Toast from '../components/toast/Toast';

const Stack = createStackNavigator();
const RootNavigator = () => {
  const [showSplashScreen, setShowSplashScreen] = React.useState(!__DEV__);

  const {loggedIn} = useUser('root');

  const hideSplashScreen = () => {
    setShowSplashScreen(false);
  };

  React.useEffect(() => {
    setTimeout(() => {
      hideSplashScreen();
    }, 500);
  }, []);

  if (showSplashScreen) {
    return <SplashScreen hideSplashScreen={hideSplashScreen} />;
  }

  return (
    <NavigationContainer>
      {/* Render custom alert and preloader  */}
      <ModalContainer />
      <Toast.Main />

      {/* Switch depending if the user has login or not */}

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {loggedIn ? (
          <Stack.Screen name="Home" component={MainStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}

        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
        <Stack.Screen name="ErrorScreen" component={ErrorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
