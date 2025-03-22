import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import HomeBottomTab from '../bottomTabs/HomeBottomTab';
import {
  CustomersScreen,
  ShareScreen,
  ShareProfileScreen,
  DeleteScreen,
  PinScreen,
  SetPinScreen,
  TopUpAmountScreen,
  NotificationScreen,
  NotificationExpandedScreen,
  ResetPinPasswordScreen,
  BulkSmsRuleScreen,
  EditTransactionHistoryScreen,
  SecurityScreen,
  UpdatePasswordScreen,
  ResetPasswordScreen,
} from '../../screens/general';

import {BottomSheets} from '../../components/general';
import {
  OtpScreenDataToCash,
  WithdrawDataToCashScreen,
} from '../../screens/general/dataToCash';
import {
  ProductPricingScreen,
  ProductPricingScreen2,
} from '../../screens/homeTabs';
import {ProductPricingScreen3} from '../../screens/homeTabs/ProductPricingScreen3';
import {
  CreateFlyersScreen,
  NewFlyers2Screen,
  NewFlyersScreen,
} from '../../screens/general/flyer';
import {ContactScreen, ProfileDetailsScreen} from '../../screens/profile';
import {UpdateProfileScreen} from '../../screens/profile/UpdateProfileScreen';

const Stack = createStackNavigator();
const MainStack = () => {
  return (
    <>
      <BottomSheets.Modal />
      <Stack.Navigator
        // initialRouteName="SuccessScreen"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="HomeBottomTab" component={HomeBottomTab} />
        <Stack.Screen name="CustomersScreen" component={CustomersScreen} />
        <Stack.Screen name="DeleteScreen" component={DeleteScreen} />
        <Stack.Screen name="ShareScreen" component={ShareScreen} />
        <Stack.Screen name="PinScreen" component={PinScreen} />
        <Stack.Screen name="TopUpAmountScreen" component={TopUpAmountScreen} />
        <Stack.Screen name="BulkSmsRuleScreen" component={BulkSmsRuleScreen} />

        <Stack.Screen
          name="ProductPricingScreen"
          component={ProductPricingScreen}
        />
        <Stack.Screen
          name="ProductPricingScreen2"
          component={ProductPricingScreen2}
        />
        <Stack.Screen
          name="ProductPricingScreen3"
          component={ProductPricingScreen3}
        />
        <Stack.Screen
          name="WithdrawDataToCashScreen"
          component={WithdrawDataToCashScreen}
        />
        <Stack.Screen
          name="OtpScreenDataToCash"
          component={OtpScreenDataToCash}
        />
        <Stack.Screen
          name="ResetPinPasswordScreen"
          component={ResetPinPasswordScreen}
        />
        <Stack.Screen name="SetPinScreen" component={SetPinScreen} />
        <Stack.Screen
          name="EditTransactionHistoryScreen"
          component={EditTransactionHistoryScreen}
        />
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
        />
        <Stack.Screen
          name="NotificationExpandedScreen"
          component={NotificationExpandedScreen}
        />
        <Stack.Screen
          name="ShareProfileScreen"
          component={ShareProfileScreen}
        />

        <Stack.Screen name="NewFlyersScreen" component={NewFlyersScreen} />
        <Stack.Screen name="NewFlyers2Screen" component={NewFlyers2Screen} />
        <Stack.Screen
          name="CreateFlyersScreen"
          component={CreateFlyersScreen}
        />
        <Stack.Screen
          name="ProfileDetailsScreen"
          component={ProfileDetailsScreen}
        />
        <Stack.Screen
          name="UpdateProfileScreen"
          component={UpdateProfileScreen}
        />
        <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
        <Stack.Screen
          name="UpdatePasswordScreen"
          component={UpdatePasswordScreen}
        />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
      </Stack.Navigator>
    </>
  );
};

export default MainStack;
