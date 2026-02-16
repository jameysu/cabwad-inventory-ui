import { Typography, Card, Flex, Spin, Table } from "antd";
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
  const { data: stockData, isLoading: stockLoading } = useGetStocksQuery();
  const { data: itemData, isLoading: itemLoading } = useGetItemsQuery();

  const stocks = stockData?.stocks ?? [];
  const items = itemData?.items ?? [];

  /* ===============================
     STATISTICS
  =============================== */
  const totalInventoryCost = stocks.reduce(
    (total, item) => total + Number(item.total_price || 0),
    0,
  );

  const totalReleasedQty = items.reduce(
    (total, item) => total + Number(item.stockout || 0),
    0,
  );

  const totalProducts = items.length;

  /* ===============================
     RECENT DATA (TOP 5)
  =============================== */
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentStocks = [...stocks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
  console.log("recentStocks", recentStocks);

  /* ===============================
     TABLE COLUMNS
  =============================== */
  const itemColumns = [
    {
      title: "Item Name",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Stock In",
      dataIndex: "stockin",
      key: "stockin",
      align: "right",
    },
    {
      title: "Stock Out",
      dataIndex: "stockout",
      key: "stockout",
      align: "right",
    },
  ];

  const stockColumns = [
    {
      title: "Control No.",
      dataIndex: "control_no",
      key: "controlno",
    },
    {
      title: "Item",
      dataIndex: "description",
      key: "item",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      align: "right",
      render: (value) => `₱${Number(value || 0).toLocaleString()}`,
    },
  ];

  return (
    <OverviewStyle>
      {/* ===============================
          STAT CARDS
      =============================== */}
      <Flex className="overview-grid">
        <Card className="overview-card inventory-cost">
          <Flex align="center" gap={16}>
            <div className="icon-wrapper">
              <DollarOutlined />
            </div>
            <Flex vertical>
              <Text className="label">Total Inventory Cost</Text>
              <Title level={4} className="value">
                {stockLoading ? (
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
                {itemLoading ? (
                  <Spin size="small" />
                ) : (
                  totalReleasedQty.toLocaleString()
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
                {itemLoading ? <Spin size="small" /> : totalProducts}
              </Title>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      {/* ===============================
          RECENT TABLES
      =============================== */}
      <div className="table-section">
        <Card className="table-card">
          <Title level={5}>🆕 Recently Added Items</Title>
          <Table
            columns={itemColumns}
            dataSource={recentItems}
            rowKey="id"
            pagination={false}
            size="small"
            loading={itemLoading}
          />
        </Card>

        <Card className="table-card">
          <Title level={5}>📦 Recently Added Stocks</Title>
          <Table
            columns={stockColumns}
            dataSource={recentStocks}
            rowKey="id"
            pagination={false}
            size="small"
            loading={stockLoading}
          />
        </Card>
      </div>
    </OverviewStyle>
  );
};

export default Overview;
