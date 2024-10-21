import React from 'react';
import { Button, Col, Popconfirm, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Detalhes from './Detalhes';
import { useCategoriaProdutoContext } from '../../context/CategoriaProduto';

export default function Item({ data }) {
  const { fetchData, paginacao, inativarItem } = useCategoriaProdutoContext();

  return (
    <Row gutter={[5, 15]}>
      <Col lg={22}
        md={21}
        xs={20}
        style={{ fontSize: 20 }}>
        <Detalhes id={data.id}
          onClose={() => fetchData()}>
          {data.descricao}
        </Detalhes>
      </Col>
      <Col lg={2}
        md={3}
        xs={4}>
        <Row gutter={[5, 5]}
          justify='end'>
          <Col>
            <Detalhes id={data.id}
              onClose={() => fetchData(paginacao.paginaAtual)}>
              <Button icon={<EditOutlined />} />
            </Detalhes>
          </Col>
          <Col>
            <Popconfirm title='Deseja inativar?'
              onConfirm={() => inativarItem(data.id)}>
              <Button danger
                icon={<DeleteOutlined />} />
            </Popconfirm>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}