import React from 'react';
import { Checkbox, Col, Form, Row } from 'antd';

export default function Parametros() {
  const parametros = [
    {
      name: 'estoqueNegativo',
      label: 'Permite estoque negativo',
    },
  ];

  return (
    <Row gutter={[10, 10]}>
      {parametros.map((parametro) => (
        <Col key={parametro.name}
          md={8}
          sm={12}
          xs={24}>
          <Form.Item noStyle
            name={parametro.name}
            valuePropName='checked'>
            <Checkbox>
              {parametro.label}
            </Checkbox>
          </Form.Item>
        </Col>
      ))}
    </Row>
  );
}