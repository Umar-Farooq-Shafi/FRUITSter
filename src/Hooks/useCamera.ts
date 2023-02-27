import { Platform } from 'react-native'
import { useState } from 'react'

import { launchCamera } from 'react-native-image-picker'
import Toast from 'react-native-toast-message'

import storage from '@react-native-firebase/storage'

export default function () {
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)
  const [image, setImage] = useState<string | null>()

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
        setUploading(false)
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
          setImage(downloadURL)
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

  return {
    uploading,
    transferred,
    image,
    captureImage,
  }
}
