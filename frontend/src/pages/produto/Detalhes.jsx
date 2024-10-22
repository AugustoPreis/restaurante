import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input } from 'antd';
import request from '../../utils/request';
import MoneyInput from '../../components/MoneyInput';
import CategoriaProdutoTypeahead from '../categoriaProduto/Typeahead';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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

    request(`/produto/${id}`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      form.setFieldsValue(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    const config = {
      method: 'POST',
      url: '/produto',
    }

    if (id) {
      config.method = 'PUT';
      config.url = `/produto/${id}`;
    }

    values.categoriaId = values.categoria?.id;

    request(config.url, {
      method: config.method,
      body: { ...values },
    }).then(() => {
      setLoading(false);
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

  const handleClear = () => {
    form.resetFields();
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
        okText={id ? 'Atualizar' : 'Salvar'}
        width={750}
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          scrollToFirstError
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col sm={8}
                xs={24}>
                <Form.Item name='codigo'
                  label='Código'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={20}
                    disabled={!!id} />
                </Form.Item>
              </Col>
              <Col sm={16}
                xs={24}>
                <Form.Item name='nome'
                  label='Nome'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={24}>
                <Form.Item name='valor'
                  label='Valor'>
                  <MoneyInput max={99999.99} />
                </Form.Item>
              </Col>
              <Col sm={16}
                xs={24}>
                <Form.Item name='categoria'
                  label='Categoria'
                  rules={[{ required: true, message: '' }]}>
                  <CategoriaProdutoTypeahead />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='descricao'
                  label='Descrição'>
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}