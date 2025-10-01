import { useState } from "react";
import { Button, Menu } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SidebarStyles from "./Sidebar.styles";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Home" },
    { key: "2", icon: <UserOutlined />, label: "Profile" },
    { key: "3", icon: <SettingOutlined />, label: "Settings" },
    { key: "4", label: <span onClick={logout}>Logout</span> },
  ];

  return (
    <SidebarStyles $open={open}>
      {/* Hamburger Button */}
      <Button
        className="menu-btn"
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setOpen((prev) => !prev)}
      />

      {/* Custom Sliding Sidebar for mobile */}
      <div className={`mobile-sidebar ${open ? "open" : ""}`}>
        <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
      </div>

      {/* Desktop Sidebar */}
      <div className="desktop-sidebar">
        <Menu mode="inline" defaultSelectedKeys={["1"]} items={menuItems} />
      </div>
    </SidebarStyles>
  );
};

export default Sidebar;
