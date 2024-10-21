import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'antd';

const NotFound = () => (
  <Row align='middle'
    justify='end'>
    <Col md={12}
      xs={24}
      style={{ textAlign: 'center', marginTop: 15 }}>
      <div style={{
        height: 320,
        backgroundImage: 'url(https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg)',
        backgroundSize: 'contain',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat'
      }} />
    </Col>
    <Col md={12}
      xs={24}
      style={{ textAlign: 'center', fontSize: 20, marginTop: 15 }}>
      <span style={{ fontSize: 40, fontWeight: 'bold' }}>
        404 <br />
      </span>
      Não foi possivel localizar a página solicitada.
      <br />
      <Link to='/'>
        <Button type='primary'
          style={{ marginTop: 10 }}>
          Ir para o inicio
        </Button>
      </Link>
    </Col>
  </Row>
);

export default NotFound;