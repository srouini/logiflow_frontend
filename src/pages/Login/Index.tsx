import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Button, Col, ConfigProvider, Flex, Form, Input, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { createStyles } from 'antd-style';

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

const LoginPage: React.FC = () => {
  const { styles } = useStyle();
  const { login, loading } = useAuth();
  const [ passwordVisible, setPasswordVisible ] = useState(false);
  const { Title } = Typography;

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    login(values.username, values.password);
  };

  useEffect(() => {
    localStorage.clear();
  },[])
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        width: "100dvw",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          paddingInline: "20px",
        }}
        className="kill"
      >
        <Row style={{ marginBottom: "40px" }} >
          <Flex vertical align="center">
          <img src="/logo.ico" width={70} />
          <Title level={2}>LOGIXPERT</Title>
          </Flex>
       
        </Row>
        <Row style={{ width: "300px" }}>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            style={{ minWidth: "100%" }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: " ",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Nom d'utilisateur"
                style={{ height: "40px", borderRadius: "18px" }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: " ",
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
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    visibilityToggle={{
                      visible: passwordVisible,
                      onVisibleChange: setPasswordVisible,
                    }}
                    placeholder="Password"
                    style={{ height: "40px", borderRadius: "18px" }}
                  />
                </Col>
                <Col span={6}>
                  <Button
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "30px",
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

            <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >

            <Form.Item>
              
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                block
                style={{ height: "40px", borderRadius: "30px" }}
                loading={loading}
              >
                Log in
              </Button>
           
            </Form.Item>
            </ConfigProvider>
          </Form>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
