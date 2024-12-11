import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import globalStyles from '../utils/globalStyles';

export default function LoadingView() {

  return (
    <View style={globalStyles.center}>
      <ActivityIndicator size='large' />
    </View>
  );
}