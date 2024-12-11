import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function PageView({ style, centered, title, children, ...props }) {
  const viewStyle = [
    styles.container,
    style,
  ];

  if (centered === true || centered === 'vertical') {
    viewStyle.push(styles.verticalCentered);
  }

  if (centered === true || centered === 'horizontal') {
    viewStyle.push(styles.horizontalCentered);
  }

  return (
    <View {...props}
      style={viewStyle}>
      {title ? (
        <Text style={styles.title}>
          {title}
        </Text>
      ) : null}
      {children || null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  verticalCentered: {
    justifyContent: 'center',
  },
  horizontalCentered: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    paddingBottom: 40,
    fontWeight: 'bold',
    color: 'black',
  },
});