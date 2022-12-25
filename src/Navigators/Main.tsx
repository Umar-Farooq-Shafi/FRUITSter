import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Ionicons from 'react-native-vector-icons/Ionicons'

import { HomeContainer } from '@/Containers'

import { MainNavHeader } from '@/Components'
import { View } from 'react-native'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <Tab.Navigator
      defaultScreenOptions={{
        tabBarActiveBackgroundColor: '#FAAD17',
        tabBarInactiveBackgroundColor: '#FAAD17',
        tabBarStyle: {
          backgroundColor: '#FAAD17',
        },
        tabBarLabelStyle: {
          backgroundColor: '#FAAD17',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeContainer}
        options={{
          headerTitle: MainNavHeader,
          tabBarIcon: () => <Ionicons name="home" size={20} color={'#fff'} />,
          headerStyle: {
            height: 150,
          },
          headerTitleAlign: 'center',
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  )
}

export default MainNavigator
