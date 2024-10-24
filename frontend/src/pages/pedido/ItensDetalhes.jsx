import React from 'react';
import { Button, Col, InputNumber, Row, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../utils/currency';
import MoneyInput from '../../components/MoneyInput';

export default function ItensDetalhes({ itens, changeItem, removerItem }) {
  const columns = [
    {
      title: 'Comanda',
      dataIndex: 'comanda',
      key: 'comanda',
      align: 'center',
      width: 100,
      render: (value, row, index) => {
        if (row.id) {
          return value;
        }

        return (
          <InputNumber min={1}
            value={value}
            precision={0}
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) => changeItem(value, index, 'comanda')} />
        );
      }
    },
    {
      title: 'Produto',
      dataIndex: 'produto',
      key: 'produto',
      render: (value) => value?.nome,
    },
    {
      title: 'Qtd.',
      dataIndex: 'quantidade',
      key: 'quantidade',
      width: 100,
      render: (value, row, index) => {
        if (row.id) {
          return Number(value || 0).toFixed(2);
        }

        return (
          <InputNumber min={0.01}
            value={value}
            precision={2}
            controls={false}
            style={{ width: '100%' }}
            onChange={(value) => changeItem(value, index, 'quantidade')} />
        );
      },
    },
    {
      title: 'Valor Unit.',
      dataIndex: 'valor',
      key: 'valor',
      width: 120,
      render: (value, row, index) => {
        if (row.id) {
          return formatCurrency(value || 0);
        }

        return (
          <MoneyInput value={value}
            onChange={(value) => changeItem(value, index, 'valor')} />
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (_, __, index) => (
        <Row gutter={[5, 5]}
          justify='center'>
          <Col>
            <Button danger
              icon={<DeleteOutlined />}
              onClick={() => removerItem(index)} />
          </Col>
        </Row>
      )
    }
  ];

  return (
    <Table size='small'
      columns={columns}
      dataSource={itens}
      pagination={false}
      scroll={{ x: 550, y: 400 }} />
  );
}