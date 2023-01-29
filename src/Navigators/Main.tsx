import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { CameraContainer, HistoryContainer, HomeContainer } from '@/Containers'

import {
  MainNavHeader,
  CameraIcon,
  HomeIcon,
  HistoryIcon,
  CustomTabBarButton,
} from '@/Components'

import { useTheme } from '@/Hooks'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  const { Common } = useTheme()

  return (
    <Tab.Navigator
      initialRouteName="Home"
      sceneContainerStyle={{
        backgroundColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Camera"
        component={CameraContainer}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <CameraIcon focused={focused} />,
          headerStyle: {
            height: 150,
          },
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 15,
            height: 70,
            backgroundColor: '#FAAD17',
            ...Common.shadow,
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          headerTitle: MainNavHeader,
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
          tabBarButton: props => <CustomTabBarButton {...props} />,
          headerStyle: {
            height: 150,
          },
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 15,
            height: 70,
            backgroundColor: '#FAAD17',
            ...Common.shadow,
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryContainer}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <HistoryIcon focused={focused} />,
          headerStyle: {
            height: 150,
          },
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            borderRadius: 15,
            height: 70,
            backgroundColor: '#FAAD17',
            ...Common.shadow,
          },
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
