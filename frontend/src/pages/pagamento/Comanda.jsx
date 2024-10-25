import React from 'react';
import { Button, Card, Col, Divider, Row } from 'antd';
import { formatCurrency } from '../../utils/currency';
import Cadastrar from './Cadastrar';

export default function Comanda({ data, pedidoId, fetch }) {

  return (
    <Card size='small'
      style={{ minHeight: 350 }}
      title={`Comanda Nº${data.numero}`}>
      <Row gutter={[10, 5]}>
        <Col span={24}
          style={{ overflowY: 'scroll' }}>
          <div style={{ height: 200 }}>
            {data.itens?.map((item, index) => {
              if (index === 0) {
                return (
                  <Row key={item.id}
                    gutter={[10, 5]}
                    style={{ marginBottom: 5 }}>
                    <Col sm={14}
                      xs={12}>
                      <b>Produto</b>
                    </Col>
                    <Col sm={5}
                      xs={6}>
                      <b>Qtd.</b>
                    </Col>
                    <Col sm={5}
                      xs={6}>
                      <b>Valor</b>
                    </Col>
                  </Row>
                );
              }

              return (
                <Row key={item.id}
                  style={{ background: index % 2 === 0 ? '' : '#f0f0f0' }}
                  gutter={[10, 5]}>
                  <Col sm={14}
                    xs={12}>
                    {item.produto.nome}
                  </Col>
                  <Col sm={5}
                    xs={6}>
                    {item.quantidade}
                  </Col>
                  <Col sm={5}
                    xs={6}>
                    {formatCurrency(item.produto.valor || 0)}
                  </Col>
                </Row>
              );
            })}
          </div>
        </Col>
        <Divider style={{ margin: 0 }} />
        <Col span={24}
          style={{ marginTop: 20 }}>
          <Row align='bottom'
            gutter={[10, 10]}>
            <Col sm={8}
              xs={12}
              style={{ fontSize: 16 }}>
              <div><b>Valor:</b></div>
              {formatCurrency(data.valor || 0)}
            </Col>
            <Col sm={8}
              xs={12}
              style={{ fontSize: 16 }}>
              <div><b>Valor Pago:</b></div>
              <span style={{ color: data.valorPago >= data.valor ? 'green' : '' }}>
                {formatCurrency(data.valorPago || 0)}
              </span>
            </Col>
            <Col sm={8}
              xs={24}>
              <Cadastrar pedidoId={pedidoId}
                comanda={data.numero}
                onClose={fetch}>
                <Button block>
                  Cadastrar
                </Button>
              </Cadastrar>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}