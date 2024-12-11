import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/currency';

export default function Item({ data }) {
  const { mesa, numero, valor, dataCadastro } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.mesa}>
        {mesa.numero} - {mesa.descricao}
      </Text>
      <Text style={styles.pedido}>
        Pedido Nº {numero}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.bold}>
          Valor:&nbsp;
        </Text>
        {formatCurrency(valor)}
      </Text>
      <Text style={styles.item}>
        <Text style={styles.bold}>
          Aberto em:&nbsp;
        </Text>
        {format(new Date(dataCadastro), 'dd/MM/yyyy HH:mm')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  mesa: {
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 10,
  },
  pedido: {
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#00000020',
  },
  item: {
    paddingVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});