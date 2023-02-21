import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Dimensions,
} from 'react-native'
import React, { useState } from 'react'
import { Button, ProgressBar, TextInput, RadioButton } from 'react-native-paper'

import { StackScreenProps } from '@react-navigation/stack'
import { launchCamera } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'

import storage from '@react-native-firebase/storage'

import { useTheme } from '@/Hooks'

import Tree from '@/Assets/Images/Tree.svg'

import { RootStackParamList, navigate } from '@/Navigators/utils'

const { width } = Dimensions.get('screen')

type Props = StackScreenProps<RootStackParamList, 'Fruit'>

export default function FruitContainer({ route }: Props) {
  const { Fonts, Gutters, Layout } = useTheme()

  const [numberOfTrees, setNumberOfTrees] = useState('4')
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)
  const [type, setType] = useState('first')

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
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 1,
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
            trees: type === 'single' ? 1 : parseInt(numberOfTrees, 10),
            imageUrl: downloadURL,
            type: route.params?.type,
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
        Gutters.smallHPadding,
        Gutters.largeVPadding,
        Layout.alignItemsCenter,
      ]}
    >
      <Text style={[Fonts.textRegular, { fontWeight: '600' }]}>
        Select number of trees
      </Text>

      <RadioButton.Group onValueChange={setType} value={type}>
        <View style={[Layout.justifyContentAround, styles.buttonsContainer]}>
          <View>
            <View style={[styles.treeContainer]}>
              <Tree />
            </View>

            <View style={[Layout.rowCenter, Gutters.smallTPadding]}>
              <RadioButton
                value="single"
                color={'#7EE26E'}
                status={'checked'}
              />
              <Text>Single Tree</Text>
            </View>
          </View>
          <View>
            <View style={[styles.treeContainer]}>
              <Tree />
            </View>

            <View style={[Layout.rowCenter, Gutters.smallTPadding]}>
              <RadioButton value="multiple" color={'#7EE26E'} />
              <Text>Multiple Tree</Text>
            </View>
          </View>
        </View>
      </RadioButton.Group>

      {type === 'multiple' && (
        <View style={styles.textInputContainer}>
          <TextInput
            value={numberOfTrees}
            onChangeText={setNumberOfTrees}
            label={'Select number of trees'}
            keyboardType="numeric"
            mode={'outlined'}
            contentStyle={{
              width: width * 0.8,
            }}
            activeOutlineColor={'#7EE26E'}
          />
        </View>
      )}

      <Button
        icon="camera"
        mode="contained-tonal"
        buttonColor={color}
        textColor={'#fff'}
        loading={uploading}
        disabled={uploading}
        uppercase
        contentStyle={styles.submit}
        onPress={captureImage}
      >
        Capture Image
      </Button>

      {uploading && (
        <View style={styles.progressBarContainer}>
          <ProgressBar
            style={styles.progressBar}
            progress={transferred}
            color={color}
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    width,
    marginVertical: 20,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  treeContainer: {
    backgroundColor: '#7EE26E',
    borderRadius: 20,
    padding: 30,
  },
  submit: {
    marginVertical: 8,
    width: width * 0.5,
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
  progressBar: {
    width: width * 0.8,
    height: 4,
  },
})
