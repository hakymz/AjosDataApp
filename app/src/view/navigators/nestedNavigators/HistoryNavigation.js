import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HistoryScreen} from '../../screens/homeTabs';
const Stack = createStackNavigator();
export const HistoryNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    </Stack.Navigator>
  );
};
