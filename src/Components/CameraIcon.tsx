import React, { PureComponent } from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface ICameraIconProps {
  focused: boolean
}

export default class CameraIcon extends PureComponent<ICameraIconProps> {
  render() {
    const { focused } = this.props

    return (
      <MaterialIcons
        name="camera"
        size={40}
        color={focused ? '#000' : '#fff'}
      />
    )
  }
}
