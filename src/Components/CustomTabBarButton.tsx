import React, { PureComponent, MouseEvent } from 'react'
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

interface ICustomTabBarButtonProps {
  children: React.ReactNode
  onPress?:
    | ((
        e: GestureResponderEvent | MouseEvent<HTMLAnchorElement, MouseEvent>,
      ) => void)
    | undefined
}

export default class CustomTabBarButton extends PureComponent<ICustomTabBarButtonProps> {
  static defaultProps = {
    onPress: null,
  }

  render() {
    const { children, onPress } = this.props

    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.buttonContainer, styles.shadow]}
      >
        <View style={styles.button}>{children}</View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    top: -30,
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 20,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 55,
    backgroundColor: '#FAAD17',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,

    elevation: 12,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.4,
    elevation: 5,
  },
})
