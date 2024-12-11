import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

export default function TruncateText({ text, lines, ...props }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View {...props}>
      <Text numberOfLines={expanded ? undefined : lines}>
        {text}
      </Text>
      {text?.trim?.() ? (
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.verMais}>
            {expanded ? (
              <Text>
                Ver menos
              </Text>
            ) : (
              <Text>
                Ver mais...
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  verMais: {
    color: 'blue',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'right',
  },
});