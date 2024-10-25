import React from 'react';
import { Col, Input, Row } from 'antd';
import { useRelatorioContext } from '../../context/Relatorio';
import Label from '../../components/Label';

export default function Filtro() {
  const { filtro, setFiltro, fetchData, loading } = useRelatorioContext();

  return (
    <Row gutter={[10, 10]}>
      <Col xl={8}
        lg={10}
        md={12}
        sm={16}
        xs={24}>
        <Label title='Filtrar:'>
          <Input.Search size='large'
            value={filtro.descricao}
            loading={loading}
            maxLength={100}
            showCount
            onSearch={() => fetchData()}
            onChange={(e) => setFiltro(e.target.value, 'descricao')} />
        </Label>
      </Col>
    </Row>
  );
}