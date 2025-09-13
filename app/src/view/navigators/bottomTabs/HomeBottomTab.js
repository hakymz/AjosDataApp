import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HistoryScreen,
  HomeScreen,
  ProfileScreen,
  ServicesScreen,
} from '../../screens/homeTabs';

const Tab = createBottomTabNavigator();

import {View, TouchableOpacity} from 'react-native';
import {COLORS} from '../../../conts';
import {TabsIcons} from '../../components/general/others/TabsIcons';
import {HomeNavigator} from '../nestedNavigators';
import {Text} from '../../components/general';
import {PopupModal} from '../../components/popupModal/PopupModal';
import {Finder} from '../../components/popupModal';

const MyTabBar = ({state, descriptors, navigation}) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 20,
        width: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          backgroundColor: COLORS.white,
          paddingHorizontal: 20,
          height: 64,
          borderRadius: 24,
          bottom: 20,
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowRadius: 20,
          shadowOpacity: 1,
          shadowOffset: {height: 10},
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
              {isFocused ? (
                <View
                  style={{
                    height: 44,
                    backgroundColor: COLORS.darkBlue,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    borderRadius: 48,
                  }}>
                  {Icon && <Icon size={21} focused={isFocused} />}
                  <Text
                    style={{marginLeft: 5}}
                    size={13}
                    medium
                    color={'#F2F4F5'}>
                    {label}
                  </Text>
                </View>
              ) : (
                <View
                  style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <Icon size={21} focused={isFocused} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
        name="FinderScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Finder',
          tabBarIcon: ({focused, size}) => {
            return focused ? (
              <TabsIcons.SearchActive size={size} />
            ) : (
              <TabsIcons.Search size={size} />
            );
          },
        }}
      />
      <Tab.Screen
        name="HistoryScreen"
        component={HistoryScreen}
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
