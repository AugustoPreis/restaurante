import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Col, Form, Input, message, notification, Row } from 'antd';
import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();

  const handleSubmit = (values) => {
    setLoading(true);

    auth
      .login(values)
      .then(() => {
        setLoading(false);
        message.success('Login realizado com sucesso!');
      }).catch((err) => {
        setLoading(false);
        notification.error({
          message: 'Erro!',
          description: err.message,
        });
      });
  }

  if (auth.isAuthenticated()) {
    return (
      <Navigate to='/painel' />
    )
  }

  return (
    <Row justify='center'
      align='middle'
      style={{ height: '80vh' }}>
      <Col xl={7}
        lg={8}
        md={10}
        sm={14}
        xs={24}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}
          initialValues={{ tipo: 'C' }}>
          <Row gutter={[10, 0]}
            justify='center'
            style={{ background: 'white', borderRadius: '10px', padding: '5px 20px 20px 20px' }}>
            <Col span={24}
              style={{
                fontSize: 30,
                fontWeight: 500, //verificar se funciona
                textAlign: 'center',
                borderBottom: '1px solid #00000020',
                paddingBottom: 15,
                marginTop: 10,
                marginBottom: 20,
              }}>
              Restaurante
            </Col>
            <Col span={24}
              style={{ fontSize: 14, fontWeight: 400, marginBottom: 20 }}>
              Informe seus dados no formulário abaixo para acessar o sistema.
            </Col>
            <Col span={24}>
              <Form.Item name='login'
                label='Login'
                rules={[{ required: true, message: 'Informe o login' }]}>
                <Input placeholder='Informe o login'
                  prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name='senha'
                label='Senha'
                rules={[{ required: true, message: 'Informe a senha' }]}>
                <Input.Password placeholder='Informe a senha'
                  onPressEnter={form.submit}
                  prefix={<UnlockOutlined />} />
              </Form.Item>
            </Col>
            <Col xl={8}
              lg={9}
              md={8}
              sm={7}
              xs={24}>
              <Button block
                type='primary'
                loading={loading}
                onClick={form.submit}>
                Entrar
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}