import styled from "styled-components";

const PortalStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 0 !important;
  background: #f9fafb;

  @media (min-width: 768px) {
    margin-left: 300px !important;
  }

  .topbar {
    height: 60px;
    border-bottom: 1px solid #e3e5e9ff;
    display: flex;
    justify-content: flex-end;
    align-items: center; /* ✅ vertical centering */
    padding: 0 24px; /* ✅ spacing from right */
    background: #fff;
  }

  /* 🔽 Dropdown menu styling */
  .ant-dropdown-menu {
    min-width: 200px;
    padding: 12px;
  }

  .ant-dropdown-menu-item {
    cursor: default;
    padding: 8px 12px;
  }

  .ant-dropdown-menu-item:hover {
    background: transparent;
  }
`;

export default PortalStyle;
