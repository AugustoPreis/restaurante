import React from 'react';
import { Card, Col, Empty, Pagination, Row } from 'antd';
import { useMesaContext } from '../../context/Mesa';
import Item from './Item';

export default function Listagem() {
  const { data, fetchData, paginacao } = useMesaContext();

  if (!Array.isArray(data) || !data.length) {
    return (
      <Card>
        <Empty style={{ fontSize: 20, padding: 15 }}
          description='Nenhuma mesa encontrada' />
      </Card>
    );
  }

  return (
    <Row gutter={[0, 10]}>
      {data.map((item) => (
        <Col key={item.id}
          span={24}>
          <Card>
            <Item data={item} />
          </Card>
        </Col>
      ))}
      <Col span={24}>
        <Pagination align='end'
          current={paginacao.paginaAtual}
          total={paginacao.total}
          pageSize={5}
          onChange={(paginaAtual) => fetchData(paginaAtual)} />
      </Col>
    </Row>
  );
}