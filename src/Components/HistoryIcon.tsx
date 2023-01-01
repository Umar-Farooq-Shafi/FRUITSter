import React, { PureComponent } from 'react'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface IHistoryIconProps {
  focused: boolean
}

export default class HistoryIcon extends PureComponent<IHistoryIconProps> {
  render() {
    const { focused } = this.props
    return (
      <MaterialIcons
        name="history"
        size={40}
        color={focused ? '#000' : '#fff'}
      />
    )
  }
}
