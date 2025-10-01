import { Button, Typography, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import NotFoundStyles from "./NotFound.styles";

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundStyles>
      <Flex vertical justify="center" align="center">
        <Title level={1} className="glitch-title">
          404
        </Title>
        <Text className="subtitle">Oops! Page not found.</Text>
        <Text type="secondary" style={{ marginBottom: "20px" }}>
          The page you’re looking for doesn’t exist or has been moved.
        </Text>
        <Button type="primary" size="large" onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </Flex>
    </NotFoundStyles>
  );
};

export default NotFound;
