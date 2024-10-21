import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, InputNumber } from 'antd';
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

    request(`/mesa/${id}`, {
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
      url: '/mesa',
    }

    if (id) {
      config.method = 'PUT';
      config.url = `/mesa/${id}`;
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
        title='Cadastro de Mesa'
        okText={id ? 'Atualizar' : 'Salvar'}
        width={500}
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
              <Col sm={6}
                xs={24}>
                <Form.Item name='numero'
                  label='Nº'
                  rules={[{ required: true, message: '' }]}>
                  <InputNumber min={0}
                    precision={0}
                    controls={false}
                    disabled={!!id}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='descricao'
                  label='Descrição'
                  rules={[{ required: true, message: '' }]}>
                  <Input showCount
                    maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}