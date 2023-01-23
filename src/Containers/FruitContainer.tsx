import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
} from 'react-native'
import React, { useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { launchCamera } from 'react-native-image-picker'

import { utils } from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage'

import firestore from '@react-native-firebase/firestore'

import { useTheme } from '@/Hooks'

import RadioButton from '@/Components/RadioButton'

import Tree from '@/Assets/Images/Tree.svg'

import { RootStackParamList } from '@/Navigators/utils'

type Props = StackScreenProps<RootStackParamList, 'Fruit'>

export default function FruitContainer({ route }: Props) {
  const { Fonts, Gutters, Layout } = useTheme()
  const [isSingle, setIsSingle] = useState([
    { id: 1, value: true, name: 'Single Tree', selected: true },
    { id: 2, value: false, name: 'Multiple Tree', selected: false },
  ])
  const [numberOfTrees, setNumberOfTrees] = useState('4')

  // create bucket storage reference to not yet existing image
  const reference = storage().ref()

  const onRadioBtnClick = (item: any) => {
    let updatedState = isSingle.map(isLikedItem =>
      isLikedItem.id === item.id
        ? { ...isLikedItem, selected: true }
        : { ...isLikedItem, selected: false },
    )
    setIsSingle(updatedState)
  }

  const captureImage = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        presentationStyle: 'fullScreen',
      },
      async ({ assets }) => {
        // path to existing file on filesystem
        const pathToFile = `${utils.FilePath.PICTURES_DIRECTORY}/black-t-shirt-sm.png`
        // uploads file
        await reference.putFile(pathToFile)
        const file = reference.getDownloadURL()
        console.log(assets)
      },
    )
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Gutters.largeHPadding,
        Gutters.largeVPadding,
        Layout.alignItemsCenter,
      ]}
    >
      <Text style={[Fonts.textRegular, { fontWeight: '600' }]}>
        Select number of trees
      </Text>

      <View
        style={[
          Layout.justifyContentBetween,
          { flexDirection: 'row', marginTop: 20, width: '95%' },
        ]}
      >
        <View style={styles.treeContainer}>
          <Tree />
        </View>
        <View style={[styles.treeContainer]}>
          <Tree />
        </View>
      </View>

      <View
        style={[
          Layout.justifyContentBetween,
          { flexDirection: 'row', marginVertical: 20, width: '90%' },
        ]}
      >
        {isSingle.map(item => (
          <RadioButton
            onPress={() => onRadioBtnClick(item)}
            selected={item.selected}
            key={item.id}
          >
            {item.name}
          </RadioButton>
        ))}
      </View>

      {isSingle[1].selected && (
        <View style={{ marginBottom: 20 }}>
          <Text style={[Fonts.textRegular, { fontWeight: '400' }]}>
            Select number of images
          </Text>

          <TextInput
            defaultValue={numberOfTrees}
            onChangeText={setNumberOfTrees}
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: 20,
              paddingHorizontal: 15,
              marginTop: 20,
            }}
          />
        </View>
      )}

      <TouchableHighlight
        style={[
          styles.submit,
          {
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
        ]}
        onPress={captureImage}
        underlayColor="#fff"
      >
        <Text style={[styles.submitText]}>Capture Images</Text>
      </TouchableHighlight>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  treeContainer: { backgroundColor: '#7EE26E', borderRadius: 20, padding: 30 },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: 150,
    borderColor: '#fff',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
})
