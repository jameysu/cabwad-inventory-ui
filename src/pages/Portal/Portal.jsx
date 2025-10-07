import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Overview from "../Overview/Overview";
import PortalStyle from "./Portal.styles";
import InventoryHistory from "../InventoryHistory/InventoryHistory";
import NotFound from "../NotFound/NotFound";
import Mris from "../MRIS/Mris";
import Item from "../Item/Item";
import ItemMaster from "../ItemMaster/ItemMaster";
import UserManagement from "../UserManagement/UserManagement";

const Portal = () => {
  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Sidebar />
      <PortalStyle>
        {/* TODO create an avatar here */}
        <div className="topbar"></div>
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
