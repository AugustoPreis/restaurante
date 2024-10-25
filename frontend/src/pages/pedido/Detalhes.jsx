import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, message, Button, Divider } from 'antd';
import request from '../../utils/request';
import MesaTypeahaed from '../mesa/Typeahead';
import ProdutoPedido from '../produto/Pedido';
import PagamentoDetalhes from '../pagamento/Detalhes';
import ItensDetalhes from './ItensDetalhes';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itens, setItens] = useState([]);
  const [form] = Form.useForm();
  const mesaWatch = Form.useWatch('mesa', form);

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (id) {
      fetch();
    }
  }

  const fetch = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/pedido/${id}`, {
      method: 'GET',
    }).then(({ itens, ...data }) => {
      setLoading(false);
      form.setFieldsValue(data);
      setItens(itens);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const normalizeBody = (body, itens) => {
    const result = { ...body, itens };

    result.mesaId = result.mesa?.id;

    if (Array.isArray(itens)) {
      result.itens = itens.map((item) => ({
        ...item,
        produtoId: item.produto?.id,
      }));
    }

    return result;
  }

  const handleSubmit = (values) => {
    setLoading(true);

    const config = {
      method: 'POST',
      url: '/pedido',
    }

    if (id) {
      config.method = 'PUT';
      config.url = `/pedido/${id}`;
    }

    const body = normalizeBody(values, itens);

    request(config.url, {
      method: config.method,
      body: body,
    }).then(() => {
      setLoading(false);
      message.success('Pedido salvo com sucesso.');
      handleClear();
      onClose?.();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleConfirmCancel = () => {
    if (!id) {
      return;
    }

    Modal.confirm({
      title: 'Atenção',
      content: 'Deseja cancelar o pedido?',
      onOk: handleCancel,
    });
  }

  const handleCancel = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/pedido/${id}/inativar`, {
      method: 'PUT',
    }).then(() => {
      setLoading(false);
      handleClear();
      message.success('Pedido cancelado com sucesso.');
      onClose?.();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const adicionarItem = (item) => {
    if (!mesaWatch) {
      return erroSemMesa();
    }

    const nItens = [...itens];

    nItens.unshift({
      index: Math.random(),
      produto: item,
      comanda: 1,
      quantidade: 1,
      valor: item.valor || 0,
    });

    setItens([...nItens]);
  }

  const changeItem = (value, index, key) => {
    if (!mesaWatch) {
      return erroSemMesa();
    }

    const nItens = [...itens];

    if (nItens[index].id) {
      return;
    }

    nItens[index][key] = value;

    setItens([...nItens]);
  }

  const removerItem = (index, removerSalvo) => {
    if (!mesaWatch) {
      return erroSemMesa();
    }

    const nItens = [...itens];

    if (nItens[index].id && !removerSalvo) {
      return removerItemSalvo(index);
    }

    nItens.splice(index, 1);

    setItens([...nItens]);
  }

  const removerItemSalvo = (index) => {
    Modal.confirm({
      title: 'Atenção!',
      content: 'O item já está salvo no pedido, deseja remover mesmo assim?',
      onOk: () => removerItem(index, true),
    });
  }

  const erroSemMesa = () => {
    message.error('Selecione uma mesa para alterar os itens do pedido.');
  }

  const handleClear = () => {
    form.resetFields();
    setItens([]);
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
        title='Lançamento de Pedido'
        okText={id ? 'Atualizar' : 'Salvar'}
        width='100%'
        centered
        destroyOnClose
        onCancel={handleClear}
        footer={
          <Row gutter={[5, 5]}
            justify='end'>
            <Divider />
            <Col>
              <Button danger
                type='dashed'
                disabled={!id}
                onClick={handleConfirmCancel}>
                Cancelar
              </Button>
            </Col>
            <Col>
              <PagamentoDetalhes id={id}>
                <Button disabled={!id}>
                  Pagamento
                </Button>
              </PagamentoDetalhes>
            </Col>
            <Col>
              <Button type='primary'
                onClick={form.submit}>
                Salvar
              </Button>
            </Col>
          </Row>
        }>
        <Form form={form}
          layout='vertical'
          scrollToFirstError
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[35, 5]}>
              <Col xl={16}
                lg={14}
                xs={24}>
                <Row gutter={[10, 5]}>
                  <Col xl={12}
                    lg={14}
                    md={12}
                    sm={14}
                    xs={24}>
                    <Form.Item name='mesa'
                      label='Mesa'
                      rules={[{ required: true, message: '' }]}>
                      <MesaTypeahaed />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name='descricao'
                      label='Descrição'>
                      <Input.TextArea autoSize={{ minRows: 3 }} />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <ItensDetalhes itens={itens}
                      changeItem={changeItem}
                      removerItem={removerItem} />
                  </Col>
                </Row>
              </Col>
              <Col xl={8}
                lg={10}
                xs={24}
                style={{ borderLeft: '1px solid #00000020' }}>
                <ProdutoPedido itens={itens}
                  adicionarItem={adicionarItem} />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}