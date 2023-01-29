import React, { useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native'
// import { useTranslation } from 'react-i18next'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { useTheme } from '@/Hooks'

import Apple from '@/Assets/Images/Apple.svg'
import Mango from '@/Assets/Images/Mango.svg'
import Orange from '@/Assets/Images/Orange.svg'
import Pear from '@/Assets/Images/Pear.svg'

import { navigate } from '@/Navigators/utils'

const HomeContainer = () => {
  // const { t } = useTranslation()
  const { Fonts, Gutters, Layout } = useTheme()
  // const dispatch = useDispatch()

  // const [userId, setUserId] = useState('9')
  // const [fetchOne, { data, isSuccess, isLoading, isFetching, error }] =
  //   useLazyFetchOneQuery()

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp()
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  })

  // const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
  //   dispatch(changeTheme({ theme, darkMode }))
  // }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Gutters.largeHPadding,
        Gutters.largeVPadding,
        {
          borderRadius: 30,
          backgroundColor: 'rgba(217, 217, 217, 0.25)',
        },
      ]}
    >
      <Text style={[Fonts.textRegular, { fontWeight: '600' }]}>
        Select Fruit Type
      </Text>

      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <View
          style={[
            Layout.row,
            Layout.rowHCenter,
            // Gutters.smallHPadding,
            Layout.fullWidth,
            Layout.justifyContentBetween,
            Gutters.largeTMargin,
          ]}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: '#EA6D6D',
              padding: 20,
            }}
            onPress={() =>
              navigate('Fruit', {
                type: 'apple',
              })
            }
          >
            <Apple width={100} height={100} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: '#FAAD17',
              padding: 20,
            }}
            onPress={() =>
              navigate('Fruit', {
                type: 'orange',
              })
            }
          >
            <Orange width={100} height={100} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <View
          style={[
            Layout.row,
            Layout.rowHCenter,
            // Gutters.smallHPadding,
            Layout.fullWidth,
            Layout.justifyContentBetween,
            Gutters.largeTMargin,
          ]}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: '#FFE24B',
              padding: 20,
            }}
            onPress={() =>
              navigate('Fruit', {
                type: 'mango',
              })
            }
          >
            <Mango width={100} height={100} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: '#AED12C',
              padding: 20,
            }}
            onPress={() =>
              navigate('Fruit', {
                type: 'pear',
              })
            }
          >
            <Pear width={100} height={100} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <View
          style={[
            Layout.row,
            Layout.rowHCenter,
            // Gutters.smallHPadding,
            Layout.fullWidth,
            Layout.justifyContentBetween,
            Gutters.largeTMargin,
            { marginBottom: 80 },
          ]}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: '#60CCB9',
              padding: 20,
            }}
          >
            <MaterialCommunityIcons name="history" size={80} />
          </TouchableOpacity>
          <View />
        </View>
      </View>
    </ScrollView>
  )
}

export default HomeContainer
