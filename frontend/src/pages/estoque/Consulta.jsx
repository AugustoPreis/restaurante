import React, { useEffect, useState } from 'react';
import { Row, Modal, Spin, Button, Col, Table } from 'antd';
import request from '../../utils/request';
import Label from '../../components/Label';
import ProdutoTypeahead from '../produto/Typeahead';
import ListagemMovimentos from './ListagemMovimentos';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 5,
  },
}

export default function Movimento({ children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState({});
  const [data, setData] = useState([]);
  const [paginacao, setPaginacao] = useState(stateInicial.paginacao);
  const columns = [
    Table.EXPAND_COLUMN,
    {
      title: 'Produto',
      key: 'nome',
      dataIndex: 'nome',
    },
    {
      title: 'Estoque',
      key: 'estoque',
      dataIndex: 'estoque',
      width: 110,
    },
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (visible) {
        fetchData();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [visible, filtro]);

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);
  }

  const fetchData = (paginaAtual = stateInicial.paginacao.paginaAtual) => {
    setLoading(true);

    const params = {
      ...paginacao,
      produtoId: filtro.produto?.id,
      movimentaEstoque: true,
      paginaAtual,
    }

    request('/produto', {
      method: 'GET',
      params,
    }).then(({ data, total }) => {
      setLoading(false);
      setData(data);
      setPaginacao({ ...paginacao, paginaAtual, total });
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const changeFiltro = (value, key) => {
    setFiltro({ ...filtro, [key]: value });
  }

  const handleClear = () => {
    setFiltro({});
    setData([]);
    setLoading(false);
    setVisible(false);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Cadastro de Produto'
        width={1000}
        centered
        destroyOnClose
        onCancel={handleClear}
        footer={
          <Button type='primary'
            onClick={handleClear}>
            Fechar
          </Button>
        }>
        <Spin spinning={loading}>
          <Row gutter={[10, 5]}>
            <Col md={10}
              sm={14}
              xs={24}>
              <Label title='Produto'>
                <ProdutoTypeahead value={filtro.produto}
                  onChange={(value) => changeFiltro(value, 'produto')} />
              </Label>
            </Col>
            <Col span={24}>
              <Table size='small'
                columns={columns}
                dataSource={data}
                rowKey='id'
                onChange={(pag) => fetchData(pag.current)}
                scroll={{ x: 500 }}
                expandable={{
                  columnTitle: 'Movimentos',
                  expandRowByClick: true,
                  expandedRowRender: (row) => (
                    <ListagemMovimentos produtoId={row.id} />
                  ),
                }}
                pagination={{
                  current: paginacao.paginaAtual,
                  pageSize: paginacao.itensPagina,
                  total: paginacao.total,
                }} />
            </Col>
          </Row>
        </Spin>
      </Modal>
    </span>
  );
}