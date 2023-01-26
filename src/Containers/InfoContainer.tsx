import { Text, ScrollView, View, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import { RootStackParamList } from '@/Navigators/utils'

import { useTheme } from '@/Hooks'

type Props = StackScreenProps<RootStackParamList, 'Info'>

export default function InfoContainer({ route }: Props) {
  const imageUrl = route.params.imageUrl
  const trees = route.params.trees

  const [imageSet, setImageSet] = useState<object[]>([])
  const { Fonts, Gutters, Layout } = useTheme()

  useEffect(() => {
    for (let index = 0; index < trees; index++) {
      if (index === 0) {
        setImageSet([
          [
            {
              id: index,
              uri: imageUrl,
            },
          ],
        ])
      } else {
        setImageSet([...imageSet, []])
      }
    }
  }, [])

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
      {Array.from({ length: trees }).map((value, index) => (
        <View key={index}>
          <Text
            style={[Fonts.textSmall, { marginBottom: 10, fontWeight: '400' }]}
          >
            Pictures of {index + 1} tree
          </Text>

          <FlatList
            data={imageSet[index]}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.uri }}
                style={{ width: 80, height: 80, borderRadius: 10 }}
              />
            )}
            keyExtractor={item => item.id}
            nestedScrollEnabled
          />
        </View>
      ))}
    </ScrollView>
  )
}
