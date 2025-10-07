import LoginStyles from "./Login.styles";
import { Form, Button, Input, Image, Typography, Flex } from "antd";
import cabwadLogo from "../../assets/images/cabwad-logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      navigate("/portal");
    }
  }, [navigate]);

  const onLogin = () => {
    localStorage.setItem("auth", "test");
    navigate("/portal");
  };

  return (
    <LoginStyles>
      <Form
        name="basic"
        onFinish={onLogin}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Flex vertical justify="center" align="center">
          <Image width={150} src={cabwadLogo} />
          <Title level={4}>Cabuyao Water District Inventory System</Title>
        </Flex>
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Sign In
        </Button>
      </Form>
    </LoginStyles>
  );
};

export default Login;
