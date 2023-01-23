import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

interface IRadioButton {
  onPress: (item: any) => void
  selected: boolean
  children: React.ReactNode
}

export default function RadioButton({
  onPress,
  selected,
  children,
}: IRadioButton) {
  return (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.radioButtonText}>{children}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: '#7EE26E',
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
})
