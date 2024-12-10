import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({});
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log(form);
  }

  const changeForm = (value, key) => {
    setForm({ ...form, [key]: value });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login
      </Text>
      <View style={styles.inputContainer}>
        <Icon size={25}
          name='mail-outline'
          style={styles.icon} />
        <TextInput style={styles.input}
          value={form.login}
          placeholder='Usuário'
          onChangeText={(value) => changeForm(value, 'login')} />
      </View>
      <View style={styles.inputContainer}>
        <Icon size={25}
          name='lock-closed-outline'
          style={styles.icon} />
        <TextInput style={styles.input}
          secureTextEntry
          placeholder='Senha'
          onChangeText={(value) => changeForm(value, 'senha')}
          value={form.senha} />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    paddingBottom: 40,
    fontWeight: 'bold',
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
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