import { useState } from "react";
import { Button, Flex, Image, Menu } from "antd";
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
import { useNavigate } from "react-router-dom";
import cabwadLogo from "../../assets/images/cabwad-logo.png";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      children: [
        { key: "overview", icon: <RiseOutlined />, label: "Overview" },
        {
          key: "inventory-history",
          icon: <HistoryOutlined />,
          label: "Inventory History",
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
      label: <span onClick={logout}>Logout</span>,
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

      <div className={`mobile-sidebar ${open ? "open" : ""}`}>
        <Flex style={{ padding: "20px" }}>
          <Image width={60} src={cabwadLogo} />
        </Flex>
        <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
      </div>

      <div className="desktop-sidebar">
        <Flex style={{ padding: "20px" }}>
          <Image width={60} src={cabwadLogo} />
        </Flex>
        <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
      </div>
    </SidebarStyles>
  );
};

export default Sidebar;
