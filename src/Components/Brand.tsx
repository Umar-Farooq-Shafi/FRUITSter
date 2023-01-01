import React from 'react'
import { View } from 'react-native'

import { useTheme } from '@/Hooks'

import Logo from '@/Assets/Images/Logo.svg'

type Props = {
  height?: number | string
  width?: number | string
}

const Brand = ({ height, width }: Props) => {
  const { Layout } = useTheme()

  return (
    <View style={{ height, width }}>
      <Logo style={Layout.fullSize} height={200} width={200} />
    </View>
  )
}

Brand.defaultProps = {
  height: 200,
  width: 200,
}

export default Brand
