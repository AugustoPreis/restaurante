import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function Button({ children, loading, loadingColor = '#fff', ...props }) {
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
      style={styles.button}>
      {button}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});