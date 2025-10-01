import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Overview from "../Overview/Overview";
import PortalStyle from "./Portal.styles";

const Portal = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <PortalStyle style={{ flex: 1, padding: "20px", marginLeft: "220px" }}>
        <Routes>
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </PortalStyle>
    </div>
  );
};

export default Portal;
