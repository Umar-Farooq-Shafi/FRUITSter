import React, { PureComponent } from 'react'

import Ionicons from 'react-native-vector-icons/Ionicons'

interface IHomeIconProps {
  focused: boolean
}

export default class HomeIcon extends PureComponent<IHomeIconProps> {
  render() {
    const { focused } = this.props
    return <Ionicons name="home" size={40} color={focused ? '#000' : '#fff'} />
  }
}
