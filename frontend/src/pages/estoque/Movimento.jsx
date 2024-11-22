import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Col, Input, Radio, InputNumber } from 'antd';
import request from '../../utils/request';
import DatePicker from '../../components/DatePicker';
import ProdutoTypeahead from '../produto/Typeahead';

export default function Movimento({ children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const produtoWatch = Form.useWatch('produto', form);

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);
  }

  const handleSubmit = (values) => {
    setLoading(true);

    if (!values.produto || !values.tipo) {
      return;
    }

    values.produtoId = values.produto.id;

    delete values.produto;

    const config = {
      method: 'POST',
      body: values,
    }

    if (values.tipo === 'S') {
      delete config.body;

      config.method = 'DELETE';
      config.params = values;
    }

    request(`/produto/${values.produtoId}/estoque`, {
      ...config,
    }).then(() => {
      setLoading(false);
      form.resetFields();
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
        okText='Movimentar'
        width={600}
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          scrollToFirstError
          onFinish={handleSubmit}
          initialValues={{ tipo: 'E', dataMovimento: new Date() }}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col span={24}>
                <Form.Item name='produto'
                  label='Produto'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                  extra={
                    <React.Fragment>
                      <b>Estoque: </b> {produtoWatch?.estoque || 0}
                    </React.Fragment>
                  }>
                  <ProdutoTypeahead params={{ movimentaEstoque: true }} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={24}>
                <Form.Item name='quantidade'
                  label='Qtd.'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <InputNumber min={0}
                    precision={2}
                    controls={false}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={24}>
                <Form.Item name='dataMovimento'
                  label='Data'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <DatePicker format='dd/MM/yyyy'
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={24}>
                <Form.Item name='tipo'
                  label='Tipo'
                  rules={[{ required: true, message: 'Campo obrigatório' }]}>
                  <Radio.Group optionType='button'>
                    <Radio value='E'>Entrada</Radio>
                    <Radio value='S'>Saída</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name='descricao'
                  label='Descrição'>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}