import React from 'react';
import { Button, Checkbox, Col, Input, Row, Select } from 'antd';
import { useUsuarioContext } from '../../context/Usuario';
import Label from '../../components/Label';
import Detalhes from './Detalhes';

export default function Filtro() {
  const { filtro, setFiltro, fetchData, loading } = useUsuarioContext();

  return (
    <Row gutter={[10, 10]}>
      <Col xl={4}
        md={6}
        sm={8}
        xs={24}>
        <Label title='Ordenar:'>
          <Select size='large'
            value={filtro.ordem}
            onChange={(value) => setFiltro(value, 'ordem')}
            style={{ width: '100%' }}>
            <Select.Option value='nome'>Nome</Select.Option>
          </Select>
          <Checkbox checked={filtro.crescente}
            onChange={(e) => setFiltro(e.target.checked, 'crescente')}>
            Crescente
          </Checkbox>
        </Label>
      </Col>
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
      <Col xl={{ span: 3, offset: 9 }}
        lg={{ span: 4, offset: 4 }}
        md={6}
        xs={24}>
        <Label title='&nbsp;'>
          <Detalhes onClose={() => fetchData()}>
            <Button block
              size='large'
              type='primary'
              onClose={() => fetchData()}>
              Cadastrar
            </Button>
          </Detalhes>
        </Label>
      </Col>
    </Row>
  );
}