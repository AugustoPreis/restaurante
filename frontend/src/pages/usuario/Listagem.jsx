import React from 'react';
import { Card, Col, Empty, Pagination, Row } from 'antd';
import { useUsuarioContext } from '../../context/Usuario';
import Item from './Item';

export default function Listagem() {
  const { data, fetchData, paginacao } = useUsuarioContext();

  if (!Array.isArray(data) || !data.length) {
    return (
      <Card>
        <Empty style={{ fontSize: 20, padding: 15 }}
          description='Nenhum usuário encontrado' />
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