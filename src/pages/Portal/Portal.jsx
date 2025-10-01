import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Overview from "../Overview/Overview";
import PortalStyle from "./Portal.styles";
import InventoryHistory from "../InventoryHistory/InventoryHistory";

const Portal = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <PortalStyle>
        {/* TODO create an avatar here */}
        <div className="topbar"></div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="/inventory-history" element={<InventoryHistory />} />
        </Routes>
      </PortalStyle>
    </div>
  );
};

export default Portal;
