import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import request from '../../utils/request';
import PageView from '../../components/PageView';
import LoadingView from '../../components/LoadingView';
import globalStyles from '../../utils/globalStyles';
import TruncateText from '../../components/TruncateText';

export default function Detalhes({ route }) {
  const [pedido, setPedido] = useState({});
  const [loading, setLoading] = useState(false);
  const navigator = useNavigation();
  const { user } = useAuth();
  const { id } = route.params;

  useEffect(() => {
    if (!id) {
      Alert.alert('Erro!', 'ID do pedido não encontrado');
      navigator.navigate('Pedidos');

      return;
    }

    fetchPedido();
  }, [id]);

  const fetchPedido = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/pedido/${id}`, {
      method: 'GET',
      user,
    }).then((pedido) => {
      setPedido({ id, ...pedido });
    }).catch((err) => {
      Alert.alert('Erro!', err.message);
      navigator.navigate('Pedidos');
    }).finally(() => {
      setLoading(false);
    });
  }

  if (loading) {
    return <LoadingView />;
  }

  //Evitar null of undefined
  if (!pedido.id) {
    return null;
  }

  //TODO: permitir adicionar itens no pedido
  //campos dos itens: (comanda(0), produto, quantidade(2), valorUnitario(2))
  return (
    <PageView>
      <Text style={styles.mesa}>
        {pedido.mesa.numero} - {pedido.mesa.descricao}
      </Text>
      <TruncateText lines={2}
        text={pedido.descricao}
        style={[pedido.descricao?.trim() && styles.descricao, globalStyles.marginBottom]} />
    </PageView>
  );
}

const styles = StyleSheet.create({
  mesa: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    opacity: 0.7,
    paddingBottom: 10,
    marginBottom: 10,
  },
  descricao: {
    marginBottom: 20,
    paddingBottom: 15,
  },
}); 