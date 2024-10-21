import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input } from 'antd';
import request from '../../utils/request';
import MaskInput from '../../components/MaskInput';
import { useAuth } from '../../providers/AuthProvider';

export default function Detalhes({ id, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();
  const isAdmin = auth.isAdmin();

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

    request(`/empresa/${id}`, {
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
    if (!isAdmin) {
      return;
    }

    setLoading(true);

    const config = {
      method: 'POST',
      url: '/empresa',
    }

    if (id) {
      config.method = 'PUT';
      config.url = `/empresa/${id}`;
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
        title='Cadastro de Empresa'
        okText={id ? 'Atualizar' : 'Salvar'}
        width={1000}
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}
        okButtonProps={{ disabled: !isAdmin }}>
        <Form form={form}
          layout='vertical'
          scrollToFirstError
          disabled={!isAdmin}
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col sm={13}
                xs={24}>
                <Form.Item name='razaoSocial'
                  label='Razão Social'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={150} />
                </Form.Item>
              </Col>
              <Col sm={11}
                xs={24}>
                <Form.Item name='nomeFantasia'
                  label='Nome Fantasia'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={24}>
                <Form.Item name='cnpj'
                  label='CNPJ'
                  rules={[{ required: true, message: '' }]}>
                  <MaskInput preset='cnpj'
                    maxLength={14} />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}