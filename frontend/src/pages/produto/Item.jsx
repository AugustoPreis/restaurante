import React from 'react';
import { Button, Col, Popconfirm, Row, Tooltip, Upload } from 'antd';
import { DeleteOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';
import { formatCurrency } from '../../utils/currency';
import { useProdutoContext } from '../../context/Produto';
import Detalhes from './Detalhes';

export default function Item({ data }) {
  const { fetchData, paginacao, inativarItem, atualizarFoto } = useProdutoContext();
  const auth = useAuth();

  return (
    <Row gutter={[5, 15]}
      justify={{ sm: 'start', xs: 'center' }}
      align='middle'>
      <Col xl={2}
        lg={3}
        md={4}
        sm={5}>
        <img src={`/arquivo/foto-produto/${data.uuid}?noCache=${new Date().getTime()}`}
          alt='Foto do produto'
          style={{
            width: 100,
            height: 100,
            borderRadius: 10,
            border: '1px solid #f0f0f0',
          }} />
      </Col>
      <Col xl={21}
        lg={20}
        md={19}
        sm={17}
        xs={24}
        style={{ paddingLeft: 15 }}>
        <Detalhes id={data.id}
          onClose={() => fetchData()}>
          <span style={{ fontSize: 20 }}>
            {data.codigo} - {data.nome}
          </span>
        </Detalhes>
        {data.valor > 0 ? (
          <div>
            <b>Valor: </b> {formatCurrency(data.valor)}
          </div>
        ) : null}
      </Col>
      <Col md={1}
        sm={2}
        xs={24}>
        <Row gutter={[10, 10]}
          justify='center'>
          <Col>
            <Upload name='foto'
              fileList={null}
              accept='image/*'
              disabled={!auth.isAdmin()}
              beforeUpload={() => false}
              onChange={({ fileList }) => atualizarFoto(fileList?.[0], data.id)}>
              <Tooltip title='Atualizar foto'>
                <Button icon={<DownloadOutlined />} />
              </Tooltip>
            </Upload>
          </Col>
          <Col>
            <Detalhes id={data.id}
              onClose={() => fetchData(paginacao.paginaAtual)}>
              <Button icon={<EditOutlined />} />
            </Detalhes>
          </Col>
          <Col>
            <Popconfirm title='Deseja inativar?'
              onConfirm={() => inativarItem(data.id)}>
              <Button danger
                icon={<DeleteOutlined />} />
            </Popconfirm>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}