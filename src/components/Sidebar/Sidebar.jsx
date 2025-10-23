import { useState } from "react";
import { Button, Flex, Image, Menu, message, Typography } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  RiseOutlined,
  HistoryOutlined,
  TableOutlined,
  ContainerOutlined,
  HddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import SidebarStyles from "./Sidebar.styles";
import { Link, useNavigate } from "react-router-dom";
import cabwadLogo from "../../assets/images/cabwad-logo.png";

const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);

  const identity = localStorage.getItem("identity");
  const role = JSON.parse(identity).usertype;

  const handleLogout = () => {
    messageApi
      .success({
        content: "Logout successful!",
        key: "logout-success",
        duration: 3,
      })
      .then(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  };

  const handleMenuClick = (e) => {
    setOpen(false);
    if (e.key === "logout") handleLogout();
  };

  let menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      children: [
        {
          key: "overview",
          icon: <RiseOutlined />,
          label: <Link to={"/portal/"}>Overview</Link>,
        },
        {
          key: "inventory-history",
          icon: <HistoryOutlined />,
          label: (
            <Link to={"/portal/inventory-history"}>Inventory History</Link>
          ),
        },
      ],
    },
    {
      key: "report",
      icon: <TableOutlined />,
      label: "Report",
      children: [
        {
          key: "mris",
          icon: <UnorderedListOutlined />,
          label: <Link to="/portal/mris">MRIS</Link>,
        },
      ],
    },
    {
      key: "inventory",
      icon: <FileDoneOutlined />,
      label: "Inventory",
      children: [
        {
          key: "item",
          icon: <ContainerOutlined />,
          label: <Link to="/portal/item">Item</Link>,
        },
        {
          key: "item-master",
          icon: <HddOutlined />,
          label: <Link to="/portal/item-master">Item Master</Link>,
        },
      ],
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  if (role === 1) {
    menuItems.splice(menuItems.length - 1, 0, {
      key: "user",
      icon: <UserOutlined />,
      label: <Link to="/portal/user-management">User Management</Link>,
    });
  }

  return (
    <>
      {contextHolder}
      <SidebarStyles $open={open}>
        <Button
          className="menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setOpen((prev) => !prev)}
        />

        {open && (
          <div className="sidebar-overlay" onClick={() => setOpen(false)} />
        )}

        <div className={`mobile-sidebar ${open ? "open" : ""}`}>
          <Flex gap={5} style={{ padding: "20px" }}>
            <Image width={60} preview={false} src={cabwadLogo} />
            <Flex vertical justify="center" style={{ color: "white" }}>
              <Text>Republic of the Philippines</Text>
              <Text>CABUYAO WATER DISTRICT</Text>
            </Flex>
          </Flex>
          <Menu
            mode="inline"
            defaultSelectedKeys={["overview"]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </div>

        <div className="desktop-sidebar">
          <Flex gap={5} style={{ padding: "20px" }}>
            <Image width={60} preview={false} src={cabwadLogo} />
            <Flex vertical justify="center">
              <Text>Republic of the Philippines</Text>
              <Text>CABUYAO WATER DISTRICT</Text>
            </Flex>
          </Flex>
          <Menu
            mode="inline"
            defaultSelectedKeys={["overview"]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </div>
      </SidebarStyles>
    </>
  );
};

export default Sidebar;
