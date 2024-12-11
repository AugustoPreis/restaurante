import React from 'react';
import { Modal as RNModal, StyleSheet, Text, View } from 'react-native';
import globalStyles from '../utils/globalStyles';
import Button from './Button';

export default function Modal({
  visible,
  title,
  children,
  footer,
  onClose,
}) {

  return (
    <RNModal transparent
      visible={visible}
      animationType='slide'
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={[styles.titleView, globalStyles.marginBottom]}>
            <Text style={styles.titleText}>
              {title}
            </Text>
          </View>
          <View style={styles.content}>
            {children}
          </View>
          <View style={styles.footer}>
            {footer || (
              <Button size='small'
                onPress={onClose}>
                Fechar
              </Button>
            )}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    margin: 20,
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingTop: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  titleView: {
    width: '100%',
    textAlign: 'left',
    marginBottom: 15,
    paddingBottom: 15,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  content: {},
  footer: {
    marginTop: 15,
    width: '100%',
  },
});