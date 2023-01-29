import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import React, { useEffect, useState } from 'react'

import { launchCamera } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'
import storage from '@react-native-firebase/storage'

import { navigate, RootStackParamList } from '@/Navigators/utils'

import { useTheme } from '@/Hooks'

import { StackScreenProps } from '@react-navigation/stack'

type Props = StackScreenProps<RootStackParamList, 'Camera'>

export default function CameraContainer({ navigation }: Props) {
  const [uploading, setUploading] = useState(false)

  const { Fonts } = useTheme()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
            navigate('Home')
          }
        },
      )
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const uploadImage = async (uri: string) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

    setUploading(true)
    const task = storage().ref(filename).putFile(uploadUri)

    // set progress state
    task.on(
      'state_changed',
      snapshot => {
        console.log(snapshot.bytesTransferred)
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
            trees: 1,
            imageUrl: downloadURL,
            type: 'Orange',
          })
        })
      },
    )

    await task
  }

  return (
    <View style={styles.main}>
      {uploading && (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color={'#0F0'} />

          <Text
            style={[
              Fonts.textCenter,
              Fonts.textRegular,
              styles.note,
              styles.loadingText,
            ]}
          >
            Uploading...
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgba(217, 217, 217, 0.25)',
  },
  loadingText: { color: '#0F0' },
  loading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 1,
    backgroundColor: '#00000040',
  },
  note: { marginBottom: 10, fontWeight: '600' },
})
