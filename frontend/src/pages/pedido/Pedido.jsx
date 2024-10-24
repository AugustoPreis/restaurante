import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import request from '../../utils/request';
import { PedidoContext } from '../../context/Pedido';
import Filtro from './Filtro';
import Listagem from './Listagem';

const stateInicial = {
  filtro: {
    descricao: '',
    ordem: 'mesa',
    crescente: true,
  },
}

export default function Pedido() {
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState(stateInicial.filtro);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);

    const params = {
      filtro: filtro.descricao,
      ordem: filtro.ordem,
      crescente: filtro.crescente,
    }

    request('/pedido', {
      method: 'GET',
      params,
    }).then(({ data }) => {
      setLoading(false);
      setData(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro',
        content: err.message,
      });
    });
  }

  const changeFiltro = (value, key) => {
    setFiltro({ ...filtro, [key]: value });
  }

  return (
    <PedidoContext.Provider value={{
      data,
      filtro,
      setFiltro: changeFiltro,
      loading,
      fetchData,
    }}>
      <Row gutter={[0, 20]}>
        <Col span={24}
          style={{ marginBottom: 20 }}>
          <Filtro />
        </Col>
        <Col span={24}>
          <Listagem />
        </Col>
      </Row>
    </PedidoContext.Provider>
  );
}