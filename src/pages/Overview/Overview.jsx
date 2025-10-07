import { Typography, Card, Flex, Image } from "antd";
import { useGetPostsMutation } from "../../services/jsonPlaceholderApi";
import OverviewStyle from "./Overview.styles";
import { DollarOutlined } from "@ant-design/icons";
import coinIcon from "../../assets/icons/coins-icon.svg";

const { Text, Title } = Typography;

const Overview = () => {
  const [
    getPosts,
    { data: posts, error: getPostsFailed, isLoading: getPostsLoading },
  ] = useGetPostsMutation();
  console.log(posts);
  return (
    <OverviewStyle>
      <Flex justify="space-around" wrap gap={10}>
        <Card className="inventory-cost">
          <Flex>
            <DollarOutlined style={{ color: "white", fontSize: "70px" }} />
            <Flex vertical>
              <Text>Total Inventory Cost</Text>
              <Title level={4}>₱276,289</Title>
            </Flex>
          </Flex>
        </Card>
        <Card className="items-out-cost">
          <Flex>
            <DollarOutlined style={{ color: "white", fontSize: "70px" }} />
            <Flex vertical>
              <Text>Total Inventory Cost</Text>
              <Title level={4}>₱276,289</Title>
            </Flex>
          </Flex>
        </Card>
        <Card className="total-product">
          <Flex>
            <DollarOutlined style={{ color: "white", fontSize: "70px" }} />
            <Flex vertical>
              <Text>Total Inventory Cost</Text>
              <Title level={4}>₱276,289</Title>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </OverviewStyle>
  );
};

export default Overview;
