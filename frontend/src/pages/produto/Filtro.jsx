import React from 'react';
import { Button, Checkbox, Col, Input, Row, Select } from 'antd';
import { useProdutoContext } from '../../context/Produto';
import Label from '../../components/Label';
import Movimento from '../estoque/Movimento';
import Detalhes from './Detalhes';

export default function Filtro() {
  const { filtro, setFiltro, fetchData, loading } = useProdutoContext();

  return (
    <Row gutter={[10, 10]}>
      <Col xl={4}
        lg={6}
        md={8}
        sm={8}
        xs={24}>
        <Label title='Ordenar:'>
          <Select size='large'
            value={filtro.ordem}
            onChange={(value) => setFiltro(value, 'ordem')}
            style={{ width: '100%' }}>
            <Select.Option value='codigo'>Código</Select.Option>
            <Select.Option value='nome'>Nome</Select.Option>
            <Select.Option value='valor'>Valor</Select.Option>
          </Select>
          <Checkbox checked={filtro.crescente}
            onChange={(e) => setFiltro(e.target.checked, 'crescente')}>
            Crescente
          </Checkbox>
        </Label>
      </Col>
      <Col xl={8}
        lg={9}
        md={16}
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
      <Col xl={{ span: 4, offset: 5 }}
        lg={5}
        md={10}
        sm={12}
        xs={24}>
        <Label title='&nbsp;'>
          <Movimento>
            <Button block
              size='large'>
              Movimentar Estoque
            </Button>
          </Movimento>
        </Label>
      </Col>
      <Col xl={3}
        lg={{ span: 4, offset: 0 }}
        md={{ span: 10, offset: 4 }}
        sm={12}
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