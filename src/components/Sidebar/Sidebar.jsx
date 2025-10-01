import { useState } from "react";
import { Button, Flex, Image, Menu, Typography } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  RiseOutlined,
  HistoryOutlined,
  TableOutlined,
} from "@ant-design/icons";
import SidebarStyles from "./Sidebar.styles";
import { Link, useNavigate } from "react-router-dom";
import cabwadLogo from "../../assets/images/cabwad-logo.png";

const { Text } = Typography;

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const handleMenuClick = (e) => {
    setOpen(false); // close on menu click
    if (e.key === "logout") logout();
  };

  const menuItems = [
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
        { key: "mris", icon: <UnorderedListOutlined />, label: "MRIS" },
      ],
    },
    {
      key: "inventory",
      icon: <FileDoneOutlined />,
      label: "Inventory",
      children: [
        { key: "item", icon: <HomeOutlined />, label: "Item" },
        { key: "item-master", icon: <HomeOutlined />, label: "Item Master" },
      ],
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <SidebarStyles $open={open}>
      <Button
        className="menu-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Overlay backdrop */}
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
  );
};

export default Sidebar;
