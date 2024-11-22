import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Col, Modal, Row, Table } from 'antd';
import request from '../../utils/request';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 5,
  },
}

export default function ListagemMovimentos({ produtoId }) {
  const [loading, setLoading] = useState(false);
  const [paginacao, setPaginacao] = useState(stateInicial.paginacao);
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'Tipo',
      key: 'tipo',
      dataIndex: 'tipo',
      width: 100,
      render: (value) => {
        const config = {
          title: 'Entrada',
          arrow: '↑',
          color: 'green',
        }

        if (value === 'S') {
          config.title = 'Saída';
          config.arrow = '↓';
          config.color = 'red';
        }

        return (
          <span style={{ color: config.color }}>
            {config.arrow} {config.title}
          </span>
        );
      },
    },
    {
      title: 'Quantidade',
      key: 'quantidade',
      dataIndex: 'quantidade',
      width: 100,
    },
    {
      title: 'Estoque',
      key: 'estoque',
      dataIndex: 'estoque',
      width: 100,
    },
    {
      title: 'Data Movimento',
      key: 'dataMovimento',
      dataIndex: 'dataMovimento',
      width: 140,
      render: (value) => value ? format(new Date(value), 'dd/MM/yyyy') : '',
    },
    {
      title: 'Descrição',
      key: 'descricao',
      dataIndex: 'descricao',
    },
  ];

  useEffect(() => {
    fetchData();
  }, [produtoId]);

  const fetchData = (paginaAtual = stateInicial.paginacao.paginaAtual) => {
    if (!produtoId) {
      return;
    }

    setLoading(true);

    const params = {
      ...paginacao,
      paginaAtual,
    }

    request(`/movimento/${produtoId}`, {
      method: 'GET',
      params,
    }).then(({ data, total }) => {
      setLoading(false);
      setData(data);
      setPaginacao({ ...paginacao, total, paginaAtual });
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  if (!Array.isArray(data) || !data.length) {
    return (
      <Row justify='center'
        align='middle'>
        <Col style={{ padding: '30px 0px', fontSize: 20, opacity: 0.8 }}>
          Nenhum movimento encontrado
        </Col>
      </Row>
    );
  }

  return (
    <Table size='small'
      rowKey='id'
      loading={loading}
      columns={columns}
      dataSource={data}
      scroll={{ x: 750 }}
      onChange={(pag) => fetchData(pag.current)}
      pagination={{
        current: paginacao.paginaAtual,
        pageSize: paginacao.itensPagina,
        total: paginacao.total,
      }} />
  );
}