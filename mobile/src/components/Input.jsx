import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

export default function Input({ icon, size = 'large', prefix, style, ...props }) {
  const inputStyle = [
    style,
    styles.container,
    size === 'small' ? styles.small : styles.large,
  ];

  return (
    <View style={inputStyle}>
      {icon}
      {prefix ? (
        <Text style={styles.prefix}>
          {prefix}
        </Text>
      ) : null}
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
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  small: {
    height: 35,
    marginBottom: 15,
  },
  large: {
    height: 50,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  withIcon: {
    marginLeft: 10,
  },
  prefix: {
    marginRight: 3,
  },
});