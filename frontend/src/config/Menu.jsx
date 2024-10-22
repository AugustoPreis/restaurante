import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Drawer, Menu as AntdMenu, Row, Tag } from 'antd';
import { LogoutOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useAuth } from '../providers/AuthProvider';
import Detalhes from '../pages/empresa/Detalhes';

export default function Menu() {
  const [selectedKey, setSelectedKey] = useState('');
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const itens = [
    {
      key: 'inicio',
      label: 'Início',
    },
    {
      key: 'mesas',
      label: 'Mesas',
    },
    {
      key: 'categoria-produto',
      label: 'Categorias de Produto',
    },
    {
      key: 'administracao',
      label: 'Administração',
      permis: ['admin'],
      type: 'group',
      children: [
        {
          key: 'usuarios',
          label: 'Usuários',
        },
      ],
    },
    {
      key: 'sair',
      label: 'Sair',
      icon: <LogoutOutlined />,
      style: { color: 'red' },
    },
  ].reduce((array, { permis, ...item }) => {
    if (!Array.isArray(permis)) {
      return array.concat(item);
    }

    if (permis.includes('admin') && !auth.isAdmin()) {
      return array;
    }

    return array.concat(item);
  }, []);

  useEffect(() => {
    changeSelected();
  }, [window.location.href]);

  const onSelect = (e) => {
    const { key } = e;

    if (key === 'sair') {
      auth.logout();
      navigate('/entrar');

      return;
    }

    setVisible(false);
    navigate(key);
  }

  const changeSelected = () => {
    const { href } = window.location;
    const painel = '/painel';

    if (!href.includes(painel)) {
      setSelectedKey('inicio');

      return;
    }

    const key = href.substring(href.indexOf(painel) + painel.length + 1);

    setSelectedKey(key.trim() || 'inicio');
  }

  return (
    <React.Fragment>
      <Row gutter={[10, 5]}
        justify='space-between'
        style={{ background: '#1890ff', padding: '10px 20px' }}>
        <Col xl={7}
          lg={8}
          md={7}
          xs={24}>
          <Button size='large'
            style={{ margin: '10px 0px' }}
            onClick={() => setVisible(!visible)}
            icon={<UnorderedListOutlined />} />
        </Col>
        <Col xl={6}
          lg={8}
          md={10}
          xs={24}
          style={{ textAlign: 'center', fontSize: 40 }}>
          Restaurante
        </Col>
        <Col xl={7}
          lg={8}
          md={7}
          xs={24}>
          <Row gutter={[10, 10]}
            justify='end'>
            {auth.isAuthenticated() ? (
              <Col>
                <Detalhes id={auth.user.empresa.id}>
                  <Tag color='blue'>
                    {auth.user.empresa.razaoSocial}
                  </Tag>
                </Detalhes>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
      <Drawer closable={false}
        onClose={() => setVisible(false)}
        width={300}
        open={visible}
        placement='left'
        styles={{
          body: {
            padding: 0,
            backgroundColor: '#edf5ef',
          },
        }}>
        <AntdMenu mode='vertical'
          items={itens}
          onSelect={onSelect}
          selectedKeys={[selectedKey]}
          style={{ backgroundColor: '#edf5ef', color: '#000' }} />
      </Drawer>
    </React.Fragment>
  );
}