import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Platform,
} from 'react-native'
import React, { useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { launchCamera } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import * as Progress from 'react-native-progress'

import storage from '@react-native-firebase/storage'

import { useTheme } from '@/Hooks'

import RadioButton from '@/Components/RadioButton'

import Tree from '@/Assets/Images/Tree.svg'

import { RootStackParamList, navigate } from '@/Navigators/utils'

type Props = StackScreenProps<RootStackParamList, 'Fruit'>

export default function FruitContainer({ route }: Props) {
  const { Fonts, Gutters, Layout } = useTheme()
  const [isSingle, setIsSingle] = useState([
    { id: 1, value: true, name: 'Single Tree', selected: true },
    { id: 2, value: false, name: 'Multiple Tree', selected: false },
  ])
  const [numberOfTrees, setNumberOfTrees] = useState('4')
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const color =
    route.params?.type === 'apple'
      ? '#EA6D6D'
      : route.params?.type === 'orange'
      ? '#FAAD17'
      : route.params?.type === 'mango'
      ? '#FFE24B'
      : route.params?.type === 'pear'
      ? '#AED12C'
      : '#0f0'

  const onRadioBtnClick = (item: any) => {
    let updatedState = isSingle.map(isLikedItem =>
      isLikedItem.id === item.id
        ? { ...isLikedItem, selected: true }
        : { ...isLikedItem, selected: false },
    )
    setIsSingle(updatedState)
  }

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

    setUploading(true)
    setTransferred(0)
    const task = storage().ref(filename).putFile(uploadUri)

    // set progress state
    task.on(
      'state_changed',
      snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
        )
      },
      error => {
        console.error(error)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: typeof error === 'string' ? error : 'Unknown error.',
        })
      },
      function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        setUploading(false)
        Toast.show({
          type: 'success',
          text1: 'Uploaded',
          text2: 'Your images uploaded successfully.',
        })
        task.snapshot?.ref.getDownloadURL().then(function (downloadURL) {
          navigate('Info', {
            trees: isSingle[0].selected ? 1 : parseInt(numberOfTrees, 10),
            imageUrl: downloadURL,
          })
        })
      },
    )

    await task
  }

  const captureImage = () => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        presentationStyle: 'fullScreen',
      },
      async ({ assets }) => {
        if (assets && assets[0].uri) {
          const uri = assets[0].uri

          await uploadImage(uri)
        } else {
          Toast.show({
            type: 'error',
            text1: 'Something went wrong',
            text2: 'You may need access the camera permissions in app setting.',
          })
        }
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
            Select number of trees
          </Text>

          <TextInput
            defaultValue={numberOfTrees}
            onChangeText={setNumberOfTrees}
            keyboardType="numeric"
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
            backgroundColor: color,
          },
        ]}
        onPress={captureImage}
        underlayColor="#fff"
      >
        <Text style={[styles.submitText]}>Capture Images</Text>
      </TouchableHighlight>

      {uploading && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={transferred} width={300} color={color} />
        </View>
      )}
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
  progressBarContainer: {
    marginTop: 20,
  },
})
