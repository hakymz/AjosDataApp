import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useUser} from '../../../hooks';
import {OnboardingScreen} from '../../screens/onboarding';
import {
  SignUpScreen,
  EmailSentSuccessScreen,
  SignInScreen,
  SignInWithBiometricScreen,
  ChangePasswordScreen,
  PasswordSuccessScreen,
  SignUpEmailScreen,
  OtpScreen,
  ForgotPasswordScreen,
  ChangePasswordSuccessScreen,
  WelcomeScreen,
} from '../../screens/auth';

const Stack = createStackNavigator();
const AuthStack = () => {
  const {settings, appHasBeenOpened} = useUser();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!appHasBeenOpened && (
        <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      )}
      {settings?.biometric ? (
        <Stack.Screen
          name="SignInWithBiometricScreen"
          component={SignInWithBiometricScreen}
        />
      ) : (
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
      )}

      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="SignUpEmailScreen" component={SignUpEmailScreen} />
      <Stack.Screen
        name="ChangePasswordSuccessScreen"
        component={ChangePasswordSuccessScreen}
      />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />

      <Stack.Screen
        name="EmailSentSuccessScreen"
        component={EmailSentSuccessScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="PasswordSuccessScreen"
        component={PasswordSuccessScreen}
      />
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
