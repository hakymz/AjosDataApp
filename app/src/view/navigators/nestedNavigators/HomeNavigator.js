import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';

import {
  BillsScreen,
  BulkSmsScreen,
  EPinScreen,
  ElectricityScreen,
  SellAirtimeScreen,
  SellDataScreen,
  TvScreen,
} from '../../screens/general';

import {HomeScreen} from '../../screens/homeTabs';
import {DataToCashScreen} from '../../screens/general/dataToCash';

const Stack = createStackNavigator();
export const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SellDataScreen" component={SellDataScreen} />
      <Stack.Screen name="SellAirtimeScreen" component={SellAirtimeScreen} />
      <Stack.Screen name="BulkSmsScreen" component={BulkSmsScreen} />
      <Stack.Screen name="ElectricityScreen" component={ElectricityScreen} />
      <Stack.Screen name="TvScreen" component={TvScreen} />
      <Stack.Screen name="EPinScreen" component={EPinScreen} />
      <Stack.Screen name="DataToCashScreen" component={DataToCashScreen} />
      <Stack.Screen name="BillsScreen" component={BillsScreen} />
    </Stack.Navigator>
  );
};
