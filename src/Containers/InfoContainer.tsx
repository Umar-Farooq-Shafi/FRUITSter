import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native'
import React, { useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import storage from '@react-native-firebase/storage'
import Toast from 'react-native-toast-message'
import { launchCamera } from 'react-native-image-picker'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Progress from 'react-native-progress'
import firestore from '@react-native-firebase/firestore'
import { getUniqueId } from 'react-native-device-info'

import { navigate, RootStackParamList } from '@/Navigators/utils'

import { useTheme } from '@/Hooks'

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
  const [isEstimating, setIsEstimating] = useState(false)
  const [totals, setTotals] = useState(1)

  const uploadImage = async (uri: string, pictureNo: number) => {
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
          const indexImages = [...imageSet]
          const item = [...indexImages[pictureNo]]
          item.push({ uri: downloadURL })
          indexImages[pictureNo] = item

          setImageSet(indexImages)
          setTotals(totals + 1)
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
            text2:
              'You might need to change camera permissions in app setting.',
          })
        }
      },
    )
  }

  const predictCount = async () => {
    for (let i = 0; i < imageSet.length; ++i) {
      if (imageSet[i].length < 2) {
        Toast.show({
          type: 'error',
          text1: 'Missing',
          text2: 'Every tree image should be at least 2.',
        })

        return
      }
    }

    const classes = type[0].toUpperCase() + type.substring(1, type.length)
    let count = 0
    imageSet.forEach((images: any[]) => {
      images.forEach(imageOb => {
        setIsEstimating(true)
        fetch(
          `https://detect.roboflow.com/fruit-detection-ml-uol/9?classes=${classes}&api_key=tW67WEmjEnSeRqdpKp8v&image=${imageOb.uri}&labels=true`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
          .then(async res => {
            const result = await res.json()

            firestore()
              .collection('Users')
              .add({
                deviceId: await getUniqueId(),
                detected: result.predictions?.length,
                predictions: result.predictions,
                estimation: 0,
                classes,
                createdAt: new Date(Date.now()),
                fileName: imageOb.uri,
              })
              .then(() => {
                setIsEstimating(false)
                console.log('added')
                count++

                if (count === totals) {
                  navigate('History')
                }
              })
              .catch(console.error)
          })
          .catch(error => {
            console.error(error)

            Toast.show({
              type: 'error',
              text1: 'Error',
              text2:
                typeof error === 'string' ? error : 'Something went wrong.',
            })
          })
      })
    })
  }

  return (
    <ScrollView style={Layout.fill} contentContainerStyle={[styles.main]}>
      {isEstimating && (
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
            Processing...
          </Text>
        </View>
      )}

      <View style={[Gutters.largeHPadding, Gutters.largeVPadding]}>
        <Text style={[Fonts.textSmall, styles.note]}>
          Note: Every tree image should be at least 2 and maximum as many as.
        </Text>

        {uploading && (
          <View
            style={styles.progressBarContainer}
            accessibilityRole="progressbar"
          >
            <Progress.Bar progress={transferred} width={350} />
          </View>
        )}

        {imageSet?.map((value: any, index: number) => (
          <View key={index}>
            <Text style={[Fonts.textSmall, styles.info]}>
              Pictures of {index + 1} tree
            </Text>

            <View style={styles.container}>
              {value.map((item: any, index2: number) => (
                <View style={styles.item} key={index2}>
                  <Image source={{ uri: item.uri }} style={styles.image} />
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
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'rgba(217, 217, 217, 0.25)',
  },
  note: { marginBottom: 10, fontWeight: '600' },
  info: { marginBottom: 10, fontWeight: '400' },
  image: { width: 90, height: 90, borderRadius: 10 },
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
    marginVertical: 10,
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
