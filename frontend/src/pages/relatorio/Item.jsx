import React, { useState } from 'react';
import { Col, Row } from 'antd';
import FiltrosItem from './FiltrosItem';

export default function Item({ data }) {
  const [filtro, setFiltro] = useState({ id: data.id });

  const changeFiltro = (value, key) => {
    setFiltro({ ...filtro, [key]: value });
  }

  return (
    <Row gutter={[5, 15]}
      align='middle'>
      <Col span={24}>
        <b style={{ fontSize: 20, opacity: 0.8 }}>
          {data.titulo}
        </b>
      </Col>
      <Col span={24}
        style={{ marginBottom: 20 }}>
        {data.descricao}
      </Col>
      <Col span={24}>
        <FiltrosItem data={filtro}
          filtros={data.filtros}
          changeData={changeFiltro} />
      </Col>
    </Row>
  );
}