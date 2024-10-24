import React from 'react';
import { Card, Col, Empty, Row } from 'antd';
import { usePedidoContext } from '../../context/Pedido';
import Item from './Item';

export default function Listagem() {
  const { data } = usePedidoContext();

  if (!Array.isArray(data) || !data.length) {
    return (
      <Card>
        <Empty style={{ fontSize: 20, padding: 15 }}
          description='Nenhum pedido encontrado' />
      </Card>
    );
  }

  return (
    <Row gutter={[10, 10]}>
      {data.map((item) => (
        <Col key={item.id}
          xl={6}
          lg={8}
          md={12}
          xs={24}>
          <Card hoverable>
            <Item data={item} />
          </Card>
        </Col>
      ))}
    </Row>
  );
}