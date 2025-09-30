import LoginStyles from "./Login.styles";
import { Button, Checkbox, Flex, Form, Image, Input, Typography } from "antd";
import cabwadLogo from "../../assets/images/cabwad-logo.png";
import goccLogo from "../../assets/images/gocc-logo.png";
import ribbonCutting from "../../assets/images/ribbon-cutting.jpg";

const { Text } = Typography;

const Login = () => {
  return (
    <LoginStyles>
      <Flex justify="space-between" className="topbar">
        <Flex gap={10} className="cabwad-logo-text">
          <Image
            src={cabwadLogo}
            width={80}
            preview={false}
            className="cabwad-logo"
          />
          <Flex vertical justify="center" className="cabwad-text">
            <Text>Republic of the Philippines</Text>
            <Text strong style={{ fontSize: "20px" }}>
              CABUYAO WATER DISTRICT
            </Text>
            <Text style={{ fontSize: "8px" }}>
              Banay-Banay, Katapatan Cabuyao City, Laguna
            </Text>
          </Flex>
        </Flex>
        <Image
          src={goccLogo}
          width={80}
          preview={false}
          className="cabwad-logo"
        />
      </Flex>
      <Flex gap={10} className="login-form">
        <div class="image-wrapper">
          <img
            src={ribbonCutting}
            preview={false}
            className="ribbon-cutting-img"
          />
        </div>
        <Form name="login" autoComplete="off">
          <Image src={ribbonCutting} preview={false} className="pipe-img" />
          <Flex vertical>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Sign In
              </Button>
            </Form.Item>
          </Flex>
        </Form>
      </Flex>
    </LoginStyles>
  );
};

export default Login;
