import LoginStyles from "./Login.styles";
import { Form, Button, Checkbox, Input, Image, Typography, Flex } from "antd";
import cabwadLogo from "../../assets/images/cabwad-logo.png";

const { Text, Title } = Typography;

const Login = () => {
  return (
    <LoginStyles>
      <Form name="basic" initialValues={{ remember: true }} autoComplete="off">
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
