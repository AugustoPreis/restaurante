import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import request from '../../utils/request';
import { useAuth } from '../../context/AuthContext';
import PageView from '../../components/PageView';
import Item from './Item';

export default function Pedidos() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigator = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    request('/pedido', {
      method: 'GET',
      user,
    }).then(({ data }) => {
      setData(data);
    }).catch((err) => {
      Alert.alert('Erro ao buscar pedidos!', err.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  const abrirPedido = (pedido) => {
    navigator.navigate('PedidoDetalhes', { id: pedido.id });
  }

  return (
    <PageView title='Pedidos Abertos'
      centered='horizontal'
      style={styles.container}>
      <ScrollView style={styles.itens}
        contentContainerStyle={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size='large' />
        ) : (
          data.map((item) => (
            <Item key={item.id}
              data={item}
              abrirPedido={() => abrirPedido(item)} />
          ))
        )}
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  itens: {
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
});