import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  ProfileScreen,
  ServicesScreen,
} from '../../screens/homeTabs';

const Tab = createBottomTabNavigator();

import {View, TouchableOpacity} from 'react-native';
import {COLORS, GENERAL} from '../../../conts';
import {TabsIcons} from '../../components/general/others/TabsIcons';
import {HistoryNavigation, HomeNavigator} from '../nestedNavigators';
import {BottomSheets, Text} from '../../components/general';
import {Flyer} from '../../components/bottomSheetModal/contents';

const MyTabBar = ({state, descriptors, navigation}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingBottom: GENERAL.platform == 'ios' ? 40 : 20,
        paddingTop: 20,
        justifyContent: 'space-evenly',
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        let isFocused = state.index === index;
        //Force focus on some screen
        if (state.index == 4 && index == 1) {
          isFocused = true;
        }

        const Icon = options?.tabBarIcon;

        const onPress = () => {
          if (route.name == 'FlyerScreen') {
            BottomSheets.show({
              component: <Flyer />,
              customSnapPoints: [480, 480],
            });
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress()}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            {Icon && <Icon size={22} focused={isFocused} />}
            <Text
              textAlign={'center'}
              style={{marginTop: 2}}
              md
              size={11}
              color={isFocused ? COLORS.blue : '#B8C6E5'}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const HomeBottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, size}) => {
            return focused ? (
              <TabsIcons.HomeActive size={size} />
            ) : (
              <TabsIcons.Home size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="HistoryNavigation"
        component={HistoryNavigation}
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({focused, size}) => {
            return focused ? (
              <TabsIcons.HistoryActive size={size} />
            ) : (
              <TabsIcons.History size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="FlyerScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Flyers',
          tabBarIcon: ({focused, size}) => {
            return focused ? (
              <TabsIcons.FlayerActive size={size} />
            ) : (
              <TabsIcons.Flayer size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({focused, size}) => {
            return focused ? (
              <TabsIcons.ProfileActive size={size} />
            ) : (
              <TabsIcons.Profile size={size} />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeBottomTab;
