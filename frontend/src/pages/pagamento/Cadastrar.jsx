import React, { useState } from 'react';
import { format } from 'date-fns';
import { Row, Modal, Form, Spin, Col, message, Table, Button, Popconfirm } from 'antd';
import request from '../../utils/request';
import { formatCurrency } from '../../utils/currency';
import MoneyInput from '../../components/MoneyInput';
import FormaPagamentoTypeahead from '../formaPagamento/Typeahead';
import { DeleteOutlined } from '@ant-design/icons';

export default function Detalhes({ comanda, pedidoId, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [form] = Form.useForm();
  const pago = data.valorPago >= data.valorComanda;
  const columns = [
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      width: 120,
      render: formatCurrency,
    },
    {
      title: 'Forma de Pagamento',
      dataIndex: 'formaPagamento',
      key: 'formaPagamento',
      render: (value) => value?.descricao,
    },
    {
      title: 'Data de Cadastro',
      dataIndex: 'dataCadastro',
      key: 'dataCadastro',
      width: 140,
      render: (value) => value ? format(value, 'dd/MM/yyyy HH:mm') : '',
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id) => (
        <Popconfirm title='Deseja remover o pagamento?'
          onConfirm={() => handleDelete(id)}>
          <Button danger
            icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (pedidoId && comanda) {
      fetch();
    }
  }

  const fetch = () => {
    setLoading(true);

    request(`/pagamento/${pedidoId}/${comanda}`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      setData(data);
      form.setFieldsValue({ valor: data.valorRestante || 0 });
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleSubmit = (values) => {
    if (pago) {
      return;
    }

    setLoading(true);

    const body = {
      ...values,
      pedidoId,
      comanda,
      formaPagamentoId: values.formaPagamento?.id,
    }

    request('/pagamento', {
      method: 'POST',
      body,
    }).then(() => {
      setLoading(false);
      message.success('Pagamento realizado com sucesso!');
      form.resetFields();
      fetch();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleDelete = (id) => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/pagamento/${id}/inativar`, {
      method: 'PUT',
    }).then(() => {
      setLoading(false);
      message.success('Pagamento removido com sucesso!');
      fetch();
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleClear = () => {
    onClose?.();
    form.resetFields();
    setData({});
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
        title='Novo Pagamento'
        okText='Salvar'
        width={650}
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}
        okButtonProps={{ disabled: pago, loading }}>
        <Form form={form}
          layout='vertical'
          scrollToFirstError
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col sm={16}
                xs={24}>
                <Form.Item name='formaPagamento'
                  label='Forma de Pagamento'
                  rules={[{ required: true, message: '' }]}>
                  <FormaPagamentoTypeahead disabled={pago} />
                </Form.Item>
              </Col>
              <Col sm={8}
                xs={14}>
                <Form.Item name='valor'
                  label='Valor'
                  rules={[{ required: true, message: '' }]}>
                  <MoneyInput disabled={pago}
                    max={data.valorRestante} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Table size='small'
                  columns={columns}
                  loading={loading}
                  dataSource={data.pagamentos || []}
                  rowKey='id'
                  pagination={false}
                  footer={() => (
                    <Row gutter={[35, 5]}>
                      <Col>
                        <div><b>Valor Comanda: </b></div>
                        {formatCurrency(data.valorComanda || 0)}
                      </Col>
                      <Col>
                        <div><b>Valor Pago: </b></div>
                        {formatCurrency(data.valorPago || 0)}
                      </Col>
                      <Col>
                        <div><b>Restante: </b></div>
                        {formatCurrency(data.valorRestante || 0)}
                      </Col>
                    </Row>
                  )} />
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}