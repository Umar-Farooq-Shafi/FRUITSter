import React from 'react'
import { SafeAreaView, StatusBar, Linking, Platform } from 'react-native'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { FruitContainer, StartupContainer, InfoContainer } from '@/Containers'

import FruitNavHeader from '@/Components/FruitNavHeader'

import { useTheme } from '@/Hooks'

import MainNavigator from './Main'

import { navigationRef } from './utils'

import Back from '@/Assets/Images/back.svg'

const Stack = createStackNavigator()

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme
  const [isReady, setIsReady] = React.useState(false)
  const [initialState, setInitialState] = React.useState()

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL()

        if (Platform.OS !== 'web' && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY)
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined

          if (state !== undefined) {
            setInitialState(state)
          }
        }
      } finally {
        setIsReady(true)
      }
    }

    if (!isReady) {
      restoreState()
    }
  }, [isReady])

  if (!isReady) {
    return null
  }

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer
        initialState={initialState}
        theme={NavigationTheme}
        ref={navigationRef}
        onStateChange={state =>
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
        }
      >
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator>
          <Stack.Screen
            name="Startup"
            component={StartupContainer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Info"
            component={InfoContainer}
            options={{ title: 'Information' }}
          />
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{
              animationEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Fruit"
            component={FruitContainer}
            options={({ route, navigation }) => ({
              headerTitle: () => <FruitNavHeader {...route} />,
              headerStyle: {
                height: 220,
                backgroundColor:
                  route.params?.type === 'apple'
                    ? '#EA6D6D'
                    : route.params?.type === 'orange'
                    ? '#FAAD17'
                    : route.params?.type === 'mango'
                    ? '#FFE24B'
                    : route.params?.type === 'pear'
                    ? '#AED12C'
                    : '#0f0',
              },
              headerTitleAlign: 'center',
              headerTitleContainerStyle: {
                width: '100%',
              },
              headerLeft: () => (
                <Back
                  width={40}
                  height={40}
                  color={'#000'}
                  onPress={() => navigation.goBack(null)}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
