import React, { useState } from 'react';
import { Row, Modal, Spin, Button, Col } from 'antd';
import { formatCurrency } from '../../utils/currency';
import request from '../../utils/request';
import Comanda from './Comanda';

export default function Detalhes({ id, children }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

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

    request(`/pedido/${id}/dados-pagamento`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      setData(data);
    }).catch((err) => {
      setLoading(false);
      Modal.error({
        title: 'Erro!',
        content: err.message,
      });
    });
  }

  const handleClear = () => {
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
        title='Listagem de Pagamentos'
        okText='Salvar'
        width='100%'
        centered
        destroyOnClose
        onCancel={handleClear}
        footer={
          <Button type='primary'
            onClick={handleClear}>
            Fechar
          </Button>
        }>
        <Spin spinning={loading}>
          <Row gutter={[10, 10]}>
            {data.comandas?.map((comanda) => (
              <Col key={comanda.numero}
                xl={8}
                md={12}
                xs={24}>
                <Comanda data={comanda}
                  fetch={fetch}
                  pedidoId={id} />
              </Col>
            ))}
            <Col span={24}
              style={{ marginTop: 20 }}>
              <Row>
                <Col style={{ fontSize: 16, marginRight: 40 }}>
                  <div><b>Valor:</b></div>
                  {formatCurrency(data.valor || 0)}
                </Col>
                <Col style={{ fontSize: 16 }}>
                  <div><b>Valor Pago:</b></div>
                  <span style={{ color: data.valorPago >= data.valor ? 'green' : '' }}>
                    {formatCurrency(data.valorPago || 0)}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </Modal>
    </span>
  );
}