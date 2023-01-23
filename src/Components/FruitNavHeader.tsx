import { View } from 'react-native'
import React from 'react'

import type { StackScreenProps } from '@react-navigation/stack'

import { useTheme } from '@/Hooks'

import Apple from '@/Assets/Images/Apple.svg'
import Mango from '@/Assets/Images/Mango.svg'
import Orange from '@/Assets/Images/Orange.svg'
import Pear from '@/Assets/Images/Pear.svg'

import { RootStackParamList } from '@/Navigators/utils'

type Props = StackScreenProps<RootStackParamList, 'Fruit'>['route']

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { Layout } = useTheme()

  return <View style={[Layout.fill, Layout.colCenter]}>{children}</View>
}

export default function FruitNavHeader({ params }: Props) {
  const type = params?.type

  if (type === 'mango') {
    return (
      <Wrapper>
        <Mango height={150} width={150} />
      </Wrapper>
    )
  }

  if (type === 'apple') {
    return (
      <Wrapper>
        <Apple height={150} width={150} />
      </Wrapper>
    )
  }

  if (type === 'orange') {
    return (
      <Wrapper>
        <Orange height={150} width={150} />
      </Wrapper>
    )
  }

  if (type === 'pear') {
    return (
      <Wrapper>
        <Pear height={150} width={150} />
      </Wrapper>
    )
  }

  return <View />
}
