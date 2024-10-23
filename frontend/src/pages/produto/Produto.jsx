import React, { useEffect, useState } from 'react';
import { Col, message, Modal, notification, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import { ProdutoContext } from '../../context/Produto';
import Filtro from './Filtro';
import Listagem from './Listagem';

const stateInicial = {
  paginacao: {
    paginaAtual: 1,
    itensPagina: 5,
  },
  filtro: {
    descricao: '',
    ordem: 'codigo',
  },
}

export default function Produto() {
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

    request(`/produto/${id}/inativar`, {
      method: 'PUT',
    }).then((produto) => {
      setLoading(false);
      message.success(`Produto ${produto.codigo} inativado`);
      fetchData();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const atualizarFoto = (foto, id) => {
    if (!foto || !id) {
      return;
    }

    notification.open({
      message: 'Atualizando foto',
      description: 'Aguarde...',
      icon: <LoadingOutlined />,
      duration: 0,
    });

    request(`/produto/${id}/foto`, {
      method: 'PUT',
      multipart: true,
      files: [foto],
    }).then(() => {
      notification.destroy();
      message.success('Foto atualizada com sucesso!');
      fetchData(paginacao.paginaAtual);
    }).catch((err) => {
      notification.destroy();
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
    <ProdutoContext.Provider value={{
      data,
      paginacao,
      setPaginacao,
      filtro,
      setFiltro: changeFiltro,
      loading,
      fetchData,
      inativarItem,
      atualizarFoto,
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
    </ProdutoContext.Provider>
  );
}