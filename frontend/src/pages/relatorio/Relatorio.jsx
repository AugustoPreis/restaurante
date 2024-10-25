import React, { useEffect, useState } from 'react';
import { Col, Modal, Row } from 'antd';
import request from '../../utils/request';
import { RelatorioContext } from '../../context/Relatorio';
import { abrirJanela } from '../../utils/abrirJanela';
import Filtro from './Filtro';
import Listagem from './Listagem';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 5,
  },
  filtro: {
    descricao: '',
  },
}

export default function Relatorio() {
  const [loading, setLoading] = useState(false);
  const [paginacao, setPaginacao] = useState(stateInicial.paginacao);
  const [filtro, setFiltro] = useState(stateInicial.filtro);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (paginaAtual = 1) => {
    setLoading(true);

    const params = {
      paginaAtual,
      filtro: filtro.descricao,
      itensPagina: paginacao.itensPagina,
    }

    request('/relatorio', {
      method: 'GET',
      params,
    }).then(({ data, total }) => {
      setLoading(false);
      setData(data);
      setPaginacao({ ...paginacao, paginaAtual, total });
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro',
        content: err.message,
      });
    });
  }

  const imprimirRelatorio = (filtros) => {
    if (!filtros.id) {
      return;
    }

    setLoading(true);

    const body = {
      usuarioId: filtros.usuario?.id,
      produtoId: filtros.produto?.id,
      dataInicio: filtros.periodo?.[0],
      dataFim: filtros.periodo?.[1],
    }

    request(`/relatorio/${filtros.id}`, {
      method: 'POST',
      body,
    }).then(({ uuid }) => {
      setLoading(false);
      abrirJanela(`/arquivo/relatorio/${uuid}`);
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
    <RelatorioContext.Provider value={{
      data,
      paginacao,
      setPaginacao,
      filtro,
      setFiltro: changeFiltro,
      loading,
      fetchData,
      imprimirRelatorio,
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
    </RelatorioContext.Provider>
  );
}