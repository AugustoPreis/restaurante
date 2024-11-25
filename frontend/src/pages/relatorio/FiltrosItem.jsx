import React, { useMemo } from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useRelatorioContext } from '../../context/Relatorio';
import { RangePicker } from '../../components/DatePicker';
import Label from '../../components/Label';
import ProdutoTypeahead from '../produto/Typeahead';
import UsuarioTypeahead from '../usuario/Typeahead';

export default function FiltrosItem({ filtros, data, changeData }) {
  const { imprimirRelatorio } = useRelatorioContext();
  const campos = useMemo(() => {
    const result = [];

    if (!Array.isArray(filtros)) {
      return result;
    }

    if (filtros.includes('periodo')) {
      result.push(
        <Col key='periodo'
          xl={6}
          lg={8}
          sm={12}
          xs={24}>
          <Label title='Período:'>
            <RangePicker value={data.periodo}
              style={{ width: '100%' }}
              format='dd/MM/yyyy'
              onChange={(value) => changeData(value, 'periodo')} />
          </Label>
        </Col>
      );
    }

    if (filtros.includes('produto')) {
      result.push(
        <Col key='produto'
          xl={7}
          lg={8}
          md={12}
          sm={12}
          xs={24}>
          <Label title='Produto:'>
            <ProdutoTypeahead value={data.produto}
              onChange={(value) => changeData(value, 'produto')} />
          </Label>
        </Col>
      );
    }

    if (filtros.includes('usuario')) {
      result.push(
        <Col key='usuario'
          xl={7}
          lg={8}
          md={12}
          sm={12}
          xs={24}>
          <Label title='Usuário:'>
            <UsuarioTypeahead value={data.usuario}
              onChange={(value) => changeData(value, 'usuario')} />
          </Label>
        </Col>
      );
    }

    return result;
  }, [filtros, data]);


  return (
    <Row gutter={[10, 5]}
      justify='end'
      align='bottom'>
      <Col span={24}>
        <Row gutter={[10, 5]}>
          {campos}
        </Row>
      </Col>
      <Divider style={{ margin: 10 }} />
      <Col xl={3}
        lg={4}
        md={6}
        sm={10}
        xs={24}>
        <Button block
          ghost
          type='primary'
          icon={<PrinterOutlined />}
          onClick={() => imprimirRelatorio(data)}>
          Imprimir
        </Button>
      </Col>
    </Row>
  );
}