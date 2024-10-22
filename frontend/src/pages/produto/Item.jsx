import React from 'react';
import { Button, Col, Popconfirm, Row } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/currency';
import { useProdutoContext } from '../../context/Produto';
import Detalhes from './Detalhes';

export default function Item({ data }) {
  const { fetchData, paginacao, inativarItem } = useProdutoContext();

  return (
    <Row gutter={[5, 15]}
      align='middle'>
      <Col lg={22}
        md={21}
        xs={20}>
        <Detalhes id={data.id}
          onClose={() => fetchData()}>
          <span style={{ fontSize: 20 }}>
            {data.codigo} - {data.nome}
          </span>
        </Detalhes>
        {data.valor > 0 ? (
          <div>
            <b>Valor: </b> {formatCurrency(data.valor)}
          </div>
        ) : null}
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