import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';

export default function Input({ icon, ...props }) {

  return (
    <View style={styles.container}>
      {icon}
      <TextInput {...props}
        style={[styles.input, icon && styles.withIcon]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  withIcon: {
    marginLeft: 10,
  },
});