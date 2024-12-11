import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import request from '../../utils/request';
import PageView from '../../components/PageView';
import LoadingView from '../../components/LoadingView';
import Button from '../../components/Button';
import Input from '../../components/Input';
import globalStyles from '../../utils/globalStyles';
import TruncateText from '../../components/TruncateText';
import SelecionarProduto from '../produto/Selecionar';

export default function Detalhes({ route }) {
  const [pedido, setPedido] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ adicionados: [] });
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

  const changeData = (value, key) => {
    setData({ ...data, [key]: value });
  }

  if (loading) {
    return <LoadingView />;
  }

  //Evitar null of undefined
  if (!pedido.id) {
    return null;
  }

  return (
    <PageView>
      <Text style={styles.mesa}>
        {pedido.mesa.numero} - {pedido.mesa.descricao}
      </Text>
      <TruncateText lines={2}
        text={pedido.descricao}
        style={[pedido.descricao?.trim() && styles.descricao, globalStyles.marginBottom]} />
      <View style={globalStyles.row}>
        <View style={{ flex: 10 }}>
          <SelecionarProduto value={data.produto?.nome}
            onSelect={(value) => changeData(value, 'produto')} />
        </View>
      </View>
      <View style={globalStyles.row}>
        <View style={{ flex: 4 }}>
          <Input size='small'
            placeholder='Comanda'
            keyboardType='number-pad'
            value={data.comanda}
            onChangeText={(value) => changeData(value, 'comanda')} />
        </View>
        <View style={{ flex: 4 }}>
          <Input size='small'
            keyboardType='numeric'
            placeholder='Qtd.'
            value={data.quantidade}
            onChangeText={(value) => changeData(value, 'quantidade')} />
        </View>
        <View style={{ flex: 5 }}>
          <Input size='small'
            prefix='R$'
            keyboardType='numeric'
            placeholder='Valor Unit.'
            value={data.valorUnit}
            onChangeText={(value) => changeData(value, 'valorUnit')} />
        </View>
      </View>
      <View style={styles.adicionar}>
        <Button>
          Adicionar Item
        </Button>
      </View>
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
  adicionar: {
    marginTop: 20,
  },
}); 