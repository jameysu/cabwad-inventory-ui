import { Typography, Card, Flex, Spin, Table } from "antd";
import OverviewStyle from "./Overview.styles";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  useGetAccuracyCountQuery,
  useGetStocksQuery,
} from "../../services/stockApi";
import { useGetItemsQuery } from "../../services/itemApi";
import { Line, Pie } from "@ant-design/plots";

const { Text, Title } = Typography;

const Overview = () => {
  const { data: stockData, isLoading: stockLoading } = useGetStocksQuery();
  const { data: itemData, isLoading: itemLoading } = useGetItemsQuery();
  const { data: accuracyData, isLoading: accuracyLoading } =
    useGetAccuracyCountQuery();

  const stocks = stockData?.stocks ?? [];
  const items = itemData?.items ?? [];

  const totalStockInCost = stocks.reduce((total, item) => {
    if (item.transaction_type === 1) {
      return total + Number(item.total_price || 0);
    }
    return total;
  }, 0);

  const totalStockOutCost = stocks.reduce((total, item) => {
    if (item.transaction_type === 2) {
      return total + Number(item.total_price || 0);
    }
    return total;
  }, 0);

  const totalProducts = items.length;

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentStocks = [...stocks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const monthlyData = stocks.reduce((acc, s) => {
    const month = new Date(s.createdAt).toLocaleString("en-US", {
      month: "short",
    });

    const existing = acc.find((m) => m.month === month);
    if (existing) {
      existing.value += Number(s.total_price || 0);
    } else {
      acc.push({ month, value: Number(s.total_price || 0) });
    }
    return acc;
  }, []);

  const monthlyAccuracyMap = {};

  stocks.forEach((s) => {
    const month = new Date(s.createdAt).toLocaleString("en-US", {
      month: "short",
    });

    if (!monthlyAccuracyMap[month]) {
      monthlyAccuracyMap[month] = {
        month,
        Accurate: 0,
        Inaccurate: 0,
      };
    }

    if (s.is_accurate === true) {
      monthlyAccuracyMap[month].Accurate += 1;
    } else if (s.is_accurate === false) {
      monthlyAccuracyMap[month].Inaccurate += 1;
    }
  });

  const lineData = Object.values(monthlyAccuracyMap).flatMap((m) => [
    {
      month: m.month,
      type: "Accurate",
      value: m.Accurate,
    },
    {
      month: m.month,
      type: "Inaccurate",
      value: m.Inaccurate,
    },
  ]);

  const lineConfig = {
    data: lineData,
    xField: "month",
    yField: "value",
    seriesField: "type",
    smooth: true,
    height: 260,
    autoFit: true,
    color: ["#52c41a", "#ff4d4f"],
    point: {
      size: 4,
    },
    legend: {
      position: "top",
    },
  };

  const pieData = [
    {
      type: "Accurate",
      value: accuracyData?.accuratecount || 0,
    },
    {
      type: "Inaccurate",
      value: accuracyData?.notaccurate || 0,
    },
  ];

  const pieConfig = {
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    height: 260,
    label: {
      type: "outer",
      formatter: (datum) => {
        const total = pieData.reduce((sum, d) => sum + d.value, 0) || 1;

        const percent = ((datum.value / total) * 100).toFixed(1);
        return `${datum.type} ${percent}%`;
      },
    },
  };

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
      key: "control_no",
    },
    {
      title: "Item",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Transaction Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      render: (value) => {
        if (value === 1) return "Stock In";
        if (value === 2) return "Stock Out";
        return "-";
      },
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
      <Flex className="overview-grid">
        <Card className="overview-card inventory-cost">
          <Flex align="center" gap={16}>
            <div className="icon-wrapper">
              <DollarOutlined />
            </div>
            <Flex vertical>
              <Text className="label">Total Stock In Cost</Text>
              <Title level={4} className="value">
                {stockLoading ? (
                  <Spin size="small" />
                ) : (
                  `₱${totalStockInCost.toLocaleString()}`
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
              <Text className="label">Total Stock Out Cost</Text>
              <Title level={4} className="value">
                {stockLoading ? (
                  <Spin size="small" />
                ) : (
                  `₱${totalStockOutCost.toLocaleString()}`
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

      <Flex gap={16} style={{ marginTop: 24 }}>
        <Card style={{ flex: 2 }}>
          <Title level={5}>📈 Monthly Accuracy Trend</Title>
          <Line {...lineConfig} />
        </Card>

        <Card style={{ flex: 1 }}>
          <Title level={5}>🎯 Stock Accuracy</Title>
          {accuracyLoading ? <Spin /> : <Pie {...pieConfig} />}
        </Card>
      </Flex>

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
