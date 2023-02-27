import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { Button, ProgressBar, TextInput, RadioButton } from 'react-native-paper'

import { StackScreenProps } from '@react-navigation/stack'

import { useTheme, useCamera } from '@/Hooks'

import Tree from '@/Assets/Images/Tree.svg'

import { RootStackParamList, navigate } from '@/Navigators/utils'

import { getColor } from '@/Utils/getColor'

const { width } = Dimensions.get('screen')

type Props = StackScreenProps<RootStackParamList, 'Fruit'>

export default function FruitContainer({ route }: Props) {
  const { Fonts, Gutters, Layout } = useTheme()

  const [numberOfTrees, setNumberOfTrees] = useState('4')
  const [type, setType] = useState('first')

  const { uploading, transferred, image, captureImage } = useCamera()

  if (!uploading && image) {
    navigate('Info', {
      trees: type === 'single' ? 1 : parseInt(numberOfTrees, 10),
      imageUrl: image,
      type: route.params?.type,
    })
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
      <Text style={[Fonts.textRegular, styles.title]}>
        Select number of trees
      </Text>

      <RadioButton.Group onValueChange={setType} value={type}>
        <View style={[Layout.justifyContentAround, styles.buttonsContainer]}>
          <View>
            <View style={[styles.treeContainer]}>
              <Tree />
            </View>

            <View style={[Layout.rowCenter, Gutters.smallTPadding]}>
              <RadioButton.Item
                value="single"
                label={'Single Tree'}
                color={'#7EE26E'}
                status={type === 'first' ? 'checked' : 'unchecked'}
              />
            </View>
          </View>
          <View>
            <View style={[styles.treeContainer]}>
              <Tree />
            </View>

            <View style={[Layout.rowCenter, Gutters.smallTPadding]}>
              <RadioButton.Item
                label={'Multiple Tree'}
                value="multiple"
                status={type === 'multiple' ? 'checked' : 'unchecked'}
                color={'#7EE26E'}
              />
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
        buttonColor={getColor(route)}
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
            color={getColor(route)}
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
  title: {
    fontWeight: '600',
  },
})
