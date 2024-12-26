import React, { useEffect, useState } from "react";
import { Button, Col, ConfigProvider, Flex, Form, Input, message, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { createStyles } from 'antd-style';
import { useAuth } from "@/context/AuthContext"
import { useNavigate, useLocation } from 'react-router-dom';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #C919D1,#3A94F1, #7138D4);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

interface LoginParams {
  username: string;
  password: string;
}


const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const from = (location.state as any)?.from?.pathname || '/';
  console.log('Login page state:', { isAuthenticated, from });

  const { styles } = useStyle();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { Title } = Typography;

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('Already authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (values: LoginParams) => {
    setLoading(true);
    try {
      console.log('Attempting login...');
      await login(values.username, values.password);
      message.success('Login successful!');
      // Navigation will be handled by the useEffect above
    } catch (error) {
      console.error('Login error:', error);
      message.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
    >

      <Row style={{ marginBottom: "50px", outline:"none"  }}>
        <div style={{ textAlign: "center", outline:"none"  }}>
          <img src="/logo.svg" style={{ outline:"none"  }} alt="Logo" width={600} />
        </div>
      </Row>

      <Row style={{ width: "100%", maxWidth: "350px" }}>
        <Form
          name="normal_login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nom d'utilisateur"
              style={{ height: "45px", borderRadius: "15px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 7,
                message: "Minimum length required 8 characters",
              },
            ]}
          >
            <Row gutter={8}>
              <Col span={18}>
                <Input.Password
                  prefix={<LockOutlined />}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  placeholder="Password"
                  style={{ height: "45px", borderRadius: "15px" }}
                />
              </Col>
              <Col span={6}>
                <Button
                  style={{
                    width: "100%",
                    height: "45px",
                    borderRadius: "15px",
                  }}
                  onClick={() =>
                    setPasswordVisible((prevState) => !prevState)
                  }
                >
                  {passwordVisible ? "Hide" : "Show"}
                </Button>
              </Col>
            </Row>
          </Form.Item>

          <ConfigProvider>
            <Form.Item>
              <Button
                type="primary"
                className="linearGradientButton"
                htmlType="submit"
                block
                style={{ height: "45px", borderRadius: "15px", backgroundColor:"#3D9970" }}
                loading={loading}
              >
                Log in
              </Button>
            </Form.Item>
          </ConfigProvider>
        </Form>
      </Row>
    </div>
  );
};

export default LoginPage;
