import LoginStyles from "./Login.styles";
import { Form, Button, Input, Image, Typography, Flex, message } from "antd";
import cabwadLogo from "../../assets/images/cabwad-logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { data: loginSuccess, error: loginFailed, isLoading }] =
    useLoginMutation();
  console.log(loginSuccess);

  const [messageApi, contextHolder] = message.useMessage();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/portal");
    }

    if (loginSuccess) {
      messageApi
        .success({
          content: "Login Successful!",
          key: "login-success",
          duration: 3,
        })
        .then(() => {
          localStorage.setItem("token", loginSuccess.token);
          localStorage.setItem("identity", JSON.stringify(loginSuccess.user));
          navigate("/portal");
        });
    }

    if (loginFailed) {
      messageApi.error({
        content: "Invalid credentails!",
        key: "login-failed",
        duration: 3,
      });
    }
  }, [dispatch, loginFailed, loginSuccess, messageApi, navigate, token]);

  const onLogin = (values) => {
    login(values);
  };

  return (
    <>
      {contextHolder}
      <LoginStyles>
        <Form
          name="basic"
          onFinish={onLogin}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Flex vertical justify="center" align="center">
            <Image width={150} src={cabwadLogo} preview={false} />
            <Title level={4}>Cabuyao Water District Inventory System</Title>
          </Flex>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading || loginSuccess}
          >
            Sign In
          </Button>
        </Form>
      </LoginStyles>
    </>
  );
};

export default Login;
