import React, { Suspense as SuspenseReact, useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';

export default function Suspense({ children, message, size, fallback }) {
  const [visible, setVisible] = useState(false);
  const minHeight = document.body.clientHeight * (80 / 100);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 200);
  }, []);

  const render = () => (
    <Row align='middle'
      justify='center'
      style={{ minHeight: size || minHeight }}>
      <Col span={24}
        style={{ textAlign: 'center', fontSize: 20 }}>
        {visible &&
          <span>
            {message || 'Carregando Sistema'} <br /> <Spin size='large' />
          </span>
        }
      </Col>
    </Row>
  );

  return (
    <SuspenseReact fallback={fallback || render()}>
      {children}
    </SuspenseReact>
  );
}