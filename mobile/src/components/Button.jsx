import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({ children, loading, size = 'large', type = 'primary', loadingColor = '#fff', ...props }) {
  const buttonStyle = [
    styles.button,
    type === 'primary' ? styles.primary : styles.normal,
    size === 'small' ? styles.small : styles.large,
  ];
  let button = children;

  if (typeof button === 'string') {
    button = (
      <Text>
        {button}
      </Text>
    );
  }

  if (loading) {
    button = (
      <ActivityIndicator color={loadingColor} />
    );
  }

  return (
    <TouchableOpacity  {...props}
      style={buttonStyle}>
      {button}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#1E90FF',
  },
  normal: {
    borderWidth: 1,
    borderColor: '#1E90FF',
  },
  small: {
    height: 35,
    marginBottom: 15,
  },
  large: {
    height: 50,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});