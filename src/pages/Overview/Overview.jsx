import { Typography, Card, Flex } from "antd";
import OverviewStyle from "./Overview.styles";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const Overview = () => {
  return (
    <OverviewStyle>
      <Flex className="overview-grid">
        <Card className="overview-card inventory-cost">
          <Flex align="center" gap={16}>
            <div className="icon-wrapper">
              <DollarOutlined />
            </div>
            <Flex vertical>
              <Text className="label">Total Inventory Cost</Text>
              <Title level={4} className="value">
                ₱276,289
              </Title>
            </Flex>
          </Flex>
        </Card>

        <Card className="overview-card items-out-cost">
          <Flex align="center" gap={16}>
            <div className="icon-wrapper">
              <ShoppingCartOutlined />
            </div>
            <Flex vertical>
              <Text className="label">Items Released</Text>
              <Title level={4} className="value">
                ₱120,540
              </Title>
            </Flex>
          </Flex>
        </Card>

        <Card className="overview-card total-product">
          <Flex align="center" gap={16}>
            <div className="icon-wrapper">
              <AppstoreOutlined />
            </div>
            <Flex vertical>
              <Text className="label">Total Products</Text>
              <Title level={4} className="value">
                1,248
              </Title>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </OverviewStyle>
  );
};

export default Overview;
