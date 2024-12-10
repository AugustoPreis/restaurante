import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import request from '../../utils/request';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Login() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, updateAuthentication } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('Pedidos');
    }
  }, []);

  const handleSubmit = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    request('/login', {
      method: 'POST',
      body: form,
    }).then((data) => {
      updateAuthentication(data);
      navigation.navigate('Pedidos');
    }).catch((err) => {
      changeForm(null, 'senha');
      Alert.alert('Erro!', err.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  const changeForm = (value, key) => {
    if (loading) {
      return;
    }

    setForm({ ...form, [key]: value });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Login
      </Text>
      <Input value={form.login}
        placeholder='Usuário'
        onChangeText={(value) => changeForm(value, 'login')}
        icon={
          <Icon size={25}
            name='user' />
        } />
      <Input value={form.senha}
        placeholder='Senha'
        onChangeText={(value) => changeForm(value, 'senha')}
        icon={
          <Icon size={25}
            name='lock' />
        } />
      <Button disabled={loading}
        loading={loading}
        onPress={handleSubmit}>
        Entrar
      </Button>
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
});