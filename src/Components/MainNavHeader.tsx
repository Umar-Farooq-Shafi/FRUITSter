import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import Logo from '@/Assets/Images/Logo.svg'
import { useTheme } from '@/Hooks'

export default function MainNavHeader(props: any) {
  console.log(props)
  const { Layout } = useTheme()

  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Logo height={100} width={100} />

      <Text style={styles.logoText}>FRUITster</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  logoText: {
    marginTop: 0,
    color: '#9FCD31',
    fontFamily: 'Hammersmith One',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 30,
  },
})
