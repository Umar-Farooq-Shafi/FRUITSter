import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
} from 'react-native'
import React, { useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import storage from '@react-native-firebase/storage'
import Toast from 'react-native-toast-message'
import { launchCamera } from 'react-native-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Progress from 'react-native-progress'

import { RootStackParamList } from '@/Navigators/utils'

import { useTheme } from '@/Hooks'

import {
  usePredictAppleMutation,
  usePredictOrangeMutation,
} from '@/Services/modules/robo'

type Props = StackScreenProps<RootStackParamList, 'Info'>

export default function InfoContainer({ route }: Props) {
  const imageUrl = route.params.imageUrl
  const trees = route.params.trees
  const type = route.params.type

  const [imageSet, setImageSet] = useState<any>(
    Array.from({ length: trees })
      .fill([])
      .fill(
        [
          {
            uri: imageUrl,
          },
        ],
        0,
        1,
      ),
  )
  const { Fonts, Gutters, Layout } = useTheme()
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const [predictApple, { isLoading: isUpdating }] = usePredictAppleMutation()
  const [predictOrange, { isLoading: isUpdating2 }] = usePredictOrangeMutation()

  const uploadImage = async (uri: string, pictureNo: number) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri

    setUploading(true)
    setTransferred(0)
    const task = storage().ref(filename).putFile(uploadUri)

    console.log(pictureNo)
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
          const indexImages = [...imageSet]
          indexImages[pictureNo].push({ uri: downloadURL })
          console.log(indexImages[pictureNo])

          setImageSet(indexImages)
        })
      },
    )

    await task
  }

  const captureImage = (pictureNo: number) => {
    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        presentationStyle: 'fullScreen',
      },
      async ({ assets }) => {
        if (assets && assets[0].uri) {
          const uri = assets[0].uri

          await uploadImage(uri, pictureNo)
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

  const predictCount = () => {
    if (type === 'apple') {
      predictApple(
        'https://lh3.googleusercontent.com/u/0/drive-viewer/AAOQEOR5frvPxS5Lj6VHhrqmvvVkFWpHyh2Lc8I7gp5u5A7IZCb1nHXxRWLi0ZzbGCbtdMp8BsAP4N2GO96cu8EIonK4ym9RWA=w2880-h1642',
      )
        .then(console.log)
        .catch(console.error)
    } else if (type === 'orange') {
      predictOrange(
        'https://lh3.googleusercontent.com/u/0/drive-viewer/AAOQEOR5frvPxS5Lj6VHhrqmvvVkFWpHyh2Lc8I7gp5u5A7IZCb1nHXxRWLi0ZzbGCbtdMp8BsAP4N2GO96cu8EIonK4ym9RWA=w2880-h1642',
      )
        .then(console.log)
        .catch(console.error)
    }
  }

  return (
    <ScrollView
      style={Layout.fill}
      contentContainerStyle={[
        Gutters.largeHPadding,
        Gutters.largeVPadding,
        {
          backgroundColor: 'rgba(217, 217, 217, 0.25)',
        },
      ]}
    >
      <Text style={[Fonts.textSmall, { marginBottom: 10, fontWeight: '600' }]}>
        Note: Every tree image should be at least 2 and maximum as many as.
      </Text>

      {imageSet?.map((value: any, index: number) => (
        <View key={index}>
          <Text
            style={[Fonts.textSmall, { marginBottom: 10, fontWeight: '400' }]}
          >
            Pictures of {index + 1} tree
          </Text>

          <View style={styles.container}>
            {value.map((item: any, index2: number) => (
              <View style={styles.item} key={index2}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 90, height: 90, borderRadius: 10 }}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.item, styles.uploadContainer]}
              disabled={uploading}
              onPress={() => captureImage(index)}
            >
              <MaterialCommunityIcons size={80} name={'file-upload'} />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableHighlight
        style={styles.submit}
        onPress={predictCount}
        underlayColor="#fff"
      >
        <Text style={[styles.submitText]}>Estimate Counts</Text>
      </TouchableHighlight>

      {uploading && (
        <View style={styles.progressBarContainer}>
          <Progress.Bar progress={transferred} width={300} />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  item: {
    width: '30%',
    marginVertical: 10,
    marginRight: 8,
  },
  progressBarContainer: {
    marginTop: 20,
  },
  uploadContainer: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    width: 150,
    alignSelf: 'center',
    borderColor: '#fff',
    backgroundColor: '#FAAD17',
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
})
