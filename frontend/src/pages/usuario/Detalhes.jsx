import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, Checkbox } from 'antd';
import request from '../../utils/request';

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

    request(`/usuario/${id}`, {
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
      url: '/usuario',
    }

    if (id) {
      config.method = 'PUT';
      config.url = `/usuario/${id}`;
    }

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
        title='Cadastro de Usuário'
        okText={id ? 'Atualizar' : 'Salvar'}
        width={800}
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
              <Col sm={14}
                xs={24}>
                <Form.Item name='nome'
                  label='Nome'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={12}
                xs={24}>
                <Form.Item name='login'
                  label='Login'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={100}
                    autoComplete='new-password' />
                </Form.Item>
              </Col>
              <Col sm={12}
                xs={24}>
                <Form.Item name='senha'
                  label='Senha'
                  extra={id ? 'Informe caso queira alterar' : null}
                  rules={[{ required: !id, message: '' }]}>
                  <Input.Password autoComplete='new-password' />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item noStyle
                  name='admin'
                  valuePropName='checked'>
                  <Checkbox>
                    Administrador
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}