import { Typography, Card, Flex, Spin } from "antd";
import OverviewStyle from "./Overview.styles";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useGetStocksQuery } from "../../services/stockApi";
import { useGetItemsQuery } from "../../services/itemApi";

const { Text, Title } = Typography;

const Overview = () => {
  const { data, isLoading } = useGetStocksQuery();
  console.log(data);
  const stocks = data?.stocks ?? [];

  const { data: fetchItemSuccess } = useGetItemsQuery();

  const totalInventoryCost = stocks.reduce(
    (total, item) => total + Number(item.total_price || 0),
    0,
  );
  console.log(totalInventoryCost);

  const totalReleasedCost = stocks.reduce(
    (total, item) => total + (item.releasedqty ?? 0) * item.unitcost,
    0,
  );

  const totalProducts = fetchItemSuccess?.items?.length;

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
                {isLoading ? (
                  <Spin size="small" />
                ) : (
                  `₱${totalInventoryCost.toLocaleString()}`
                )}
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
                {isLoading ? (
                  <Spin size="small" />
                ) : (
                  `₱${totalReleasedCost.toLocaleString()}`
                )}
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
              <Text className="label">Total Items</Text>
              <Title level={4} className="value">
                {isLoading ? <Spin size="small" /> : totalProducts}
              </Title>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </OverviewStyle>
  );
};

export default Overview;
