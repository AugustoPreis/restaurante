import React from 'react';
import { format } from 'date-fns';
import { Col, Divider, Row } from 'antd';
import { formatCurrency } from '../../utils/currency';
import { usePedidoContext } from '../../context/Pedido';
import Detalhes from './Detalhes';

export default function Item({ data }) {
  const { fetchData } = usePedidoContext();

  if (!data.mesa) {
    return null;
  }

  return (
    <Detalhes id={data.id}
      onClose={() => fetchData()}>
      <Row gutter={[10, 5]}>
        <Col span={24}
          style={{ fontSize: 25, textAlign: 'center' }}>
          {data.mesa.numero} - {data.mesa.descricao}
        </Col>
        <Col span={24}
          style={{ textAlign: 'center' }}>
          Pedido Nº {data.numero}
        </Col>
        <Divider style={{ margin: '10px 0px' }} />
        {data.valor > 0 ? (
          <Col span={24}>
            <b>Valor:</b> {formatCurrency(data.valor)}
          </Col>
        ) : null}
        {data.dataCadastro ? (
          <Col span={24}>
            <b>Aberto em:</b> {format(new Date(data.dataCadastro), 'dd/MM/yyyy HH:mm')}
          </Col>
        ) : null}
      </Row>
    </Detalhes>
  );
}