import React, { useEffect, useState } from 'react';
import { Col, message, Modal, Row } from 'antd';
import request from '../../utils/request';
import { UsuarioContext } from '../../context/Usuario';
import Filtro from './Filtro';
import Listagem from './Listagem';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 5,
  },
  filtro: {
    descricao: '',
    ordem: 'nome',
  },
}

export default function Usuario() {
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
      filtro: filtro.descricao,
      ordem: filtro.ordem,
      crescente: filtro.crescente,
      paginaAtual,
      itensPagina: 5,
    }

    request('/usuario', {
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

  const inativarItem = (id) => {
    if (!id || loading) {
      return;
    }

    setLoading(true);

    request(`/usuario/${id}/inativar`, {
      method: 'PUT',
    }).then(() => {
      setLoading(false);
      message.success('Usuário inativado');
      fetchData();
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

  return (
    <UsuarioContext.Provider value={{
      data,
      paginacao,
      setPaginacao,
      filtro,
      setFiltro: changeFiltro,
      loading,
      fetchData,
      inativarItem,
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
    </UsuarioContext.Provider>
  );
}