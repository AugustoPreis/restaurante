import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import request from '../../utils/request';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Input from '../../components/Input';
import { useEffect } from 'react';

export default function Selecionar({ value, onSelect }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [data, setData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visible) {
        fetchData();
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [filtro, visible]);

  const open = () => {
    setVisible(true);
  }

  const close = () => {
    setVisible(false);
  }

  const selecionar = (item) => {
    onSelect?.(item);
    close();
  }

  const fetchData = () => {
    setLoading(true);

    request('/produto', {
      method: 'GET',
      user,
      params: {
        paginaAtual: 1,
        itensPagina: 5,
        filtro,
      }
    }).then(({ data }) => {
      setData(data);
    }).catch((err) => {
      Alert.alert('Erro!', err.message);
      close();
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <View>
      <Button size='small'
        type='normal'
        onPress={open}>
        {value || 'Selecionar Produto'}
      </Button>
      <Modal title='Selecionar Produto'
        visible={visible}
        onClose={close}>
        <View style={styles.filtro}>
          <Text style={styles.filtroText}>
            Filtrar produtos...
          </Text>
          <Input size='small'
            value={filtro}
            onChangeText={(value) => setFiltro(value)} />
        </View>
        <View style={styles.itens}
          contentContainerStyle={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size='large' />
          ) : (
            data.map((item) => (
              <Button type='normal'
                onPress={() => selecionar(item)}>
                {item.nome}
              </Button>
            ))
          )}
          <Button type='normal'
            onPress={() => selecionar(null)}>
            Limpar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  filtro: {
    width: '100%',
    marginBottom: 10,
  },
  filtroText: {
    marginBottom: 5,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
});