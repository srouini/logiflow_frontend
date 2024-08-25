import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { Title } = Typography;

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    login(values.username, values.password);
  };

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
        <Row style={{ marginBottom: "40px" }}>
          <Title level={2}>LOGIXPERT</Title>
        </Row>
        <Row style={{ width: "350px" }}>
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
          </Form>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
