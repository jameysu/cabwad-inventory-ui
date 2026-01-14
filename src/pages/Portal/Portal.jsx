import { Route, Routes } from "react-router-dom";
import { Avatar, Dropdown, Typography, Space, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import Sidebar from "../../components/Sidebar/Sidebar";
import Overview from "../Overview/Overview";
import PortalStyle from "./Portal.styles";
import InventoryHistory from "../InventoryHistory/InventoryHistory";
import NotFound from "../NotFound/NotFound";
import Mris from "../MRIS/Mris";
import Item from "../Item/Item";
import ItemMaster from "../ItemMaster/ItemMaster";
import UserManagement from "../UserManagement/UserManagement";
import { useGetUserTypesQuery } from "../../services/genApi";

const { Text } = Typography;

/* ---------------- utils ---------------- */

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("identity");
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Invalid identity in localStorage", err);
    return null;
  }
};

/* ---------------- component ---------------- */

const Portal = () => {
  // 🔹 user from localStorage → redux fallback
  const storedUser = getStoredUser();
  const reduxUser = useSelector((state) => state.auth?.user);
  const user = storedUser || reduxUser;

  // 🔹 fetch user types (gentables)
  const { data, isLoading } = useGetUserTypesQuery("USERTYPE");
  const userTypes = data?.gentables ?? [];

  // 🔹 map usertype (number) → role name (ADMIN, etc.)
  const userRole =
    userTypes.find((t) => t.recordno === user?.usertype)?.recordname ||
    "Administrator";

  const menuItems = [
    {
      key: "profile",
      label: (
        <Space direction="vertical" size={0}>
          <Text strong>{user?.username || user?.name || "John Doe"}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {isLoading ? "Loading..." : userRole}
          </Text>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar />

      <PortalStyle>
        {/* ---------- top bar ---------- */}
        <div className="topbar">
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
          </Dropdown>
        </div>

        {/* ---------- routes ---------- */}
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="inventory-history" element={<InventoryHistory />} />
          <Route path="mris" element={<Mris />} />
          <Route path="item" element={<Item />} />
          <Route path="item-master" element={<ItemMaster />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortalStyle>
    </div>
  );
};

export default Portal;
