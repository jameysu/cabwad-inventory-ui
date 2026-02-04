import { useState } from "react";
import { Button, Flex, Image, Menu, message, Typography } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  FileDoneOutlined,
  LogoutOutlined,
  TableOutlined,
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

  // ✅ Safe identity parsing
  const identity = localStorage.getItem("identity");
  const parsedIdentity = identity ? JSON.parse(identity) : null;
  const role = parsedIdentity ? Number(parsedIdentity.usertype) : null;

  const handleLogout = () => {
    messageApi
      .success({
        content: "Logout successful!",
        key: "logout-success",
        duration: 2,
      })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("identity");
        navigate("/");
      });
  };

  const handleMenuClick = (e) => {
    setOpen(false);
    if (e.key === "logout") handleLogout();
  };

  // ✅ Main menu items
  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: <Link to="/portal/">Dashboard</Link>,
    },
    {
      key: "report",
      icon: <TableOutlined />,
      label: <Link to="/portal/mris">MRIS</Link>,
    },
    {
      key: "inventory",
      icon: <FileDoneOutlined />,
      label: <Link to="/portal/item">Item</Link>,
    },
  ];

  // ✅ Admin-only menu
  if (role === 1) {
    menuItems.push({
      key: "user",
      icon: <UserOutlined />,
      label: <Link to="/portal/user-management">User Management</Link>,
    });
  }

  // ✅ Logout item
  const logoutItem = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
    },
  ];

  return (
    <>
      {contextHolder}
      <SidebarStyles $open={open}>
        {/* MOBILE MENU BUTTON */}
        <Button
          className="menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setOpen((prev) => !prev)}
        />

        {open && (
          <div className="sidebar-overlay" onClick={() => setOpen(false)} />
        )}

        {/* ================= MOBILE SIDEBAR ================= */}
        <div className={`mobile-sidebar ${open ? "open" : ""}`}>
          {/* HEADER */}
          <Flex gap={5} style={{ padding: "20px" }}>
            <Image width={60} preview={false} src={cabwadLogo} />
            <Flex vertical justify="center" style={{ color: "white" }}>
              <Text>Republic of the Philippines</Text>
              <Text>CABUYAO WATER DISTRICT</Text>
            </Flex>
          </Flex>

          {/* MAIN MENU */}
          <Menu mode="inline" items={menuItems} onClick={handleMenuClick} />

          {/* LOGOUT AT BOTTOM */}
          <div className="logout-wrapper">
            <Menu mode="inline" items={logoutItem} onClick={handleMenuClick} />
          </div>
        </div>

        {/* ================= DESKTOP SIDEBAR ================= */}
        <div className="desktop-sidebar">
          {/* HEADER */}
          <Flex gap={5} style={{ padding: "20px" }}>
            <Image width={60} preview={false} src={cabwadLogo} />
            <Flex vertical justify="center">
              <Text>Republic of the Philippines</Text>
              <Text>CABUYAO WATER DISTRICT</Text>
            </Flex>
          </Flex>

          {/* MAIN MENU */}
          <Menu mode="inline" items={menuItems} onClick={handleMenuClick} />

          {/* LOGOUT AT BOTTOM */}
          <div className="logout-wrapper">
            <Menu mode="inline" items={logoutItem} onClick={handleMenuClick} />
          </div>
        </div>
      </SidebarStyles>
    </>
  );
};

export default Sidebar;
