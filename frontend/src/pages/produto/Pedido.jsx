import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Modal, Row } from 'antd';
import request from '../../utils/request';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 20,
  },
}

export default function Pedido({ adicionarItem }) {
  const [filtro, setFiltro] = useState(null);
  const [paginacao, setPaginacao] = useState(stateInicial.paginacao);
  const [data, setData] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filtro]);

  const fetchData = (paginaAtual = 1) => {
    const params = {
      filtro,
      ...paginacao,
      ordem: 'nome',
      crescente: true,
      paginaAtual,
    }

    request('/produto', {
      method: 'GET',
      params,
    }).then(({ data, total }) => {
      setData(data);
      setPaginacao({ ...paginacao, paginaAtual, total });
    }).catch((err) => {
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  return (
    <Row gutter={[10, 5]}>
      <Col span={24}
        style={{ marginBottom: 20 }}>
        <Input value={filtro}
          maxLength={100}
          placeholder='Filtrar produtos...'
          onChange={(e) => setFiltro(e.target.value)} />
      </Col>
      <Col style={{ overflowY: 'scroll' }}>
        <Row gutter={[10, 5]}
          style={{ maxHeight: 600 }}>
          {data.map((item) => (
            <Col key={item.id}
              span={24}>
              <Card size='small'
                hoverable
                style={{ cursor: 'pointer' }}
                onClick={() => adicionarItem(item)}>
                <span style={{ fontSize: 16 }}>
                  {item.codigo} - {item.nome}
                </span>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}