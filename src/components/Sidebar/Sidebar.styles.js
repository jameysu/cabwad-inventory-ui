import styled from "styled-components";

const SidebarStyles = styled.div`
  .menu-btn {
    position: fixed;
    top: 15px;
    left: ${({ $open }) => ($open ? "310px" : "15px")};
    z-index: 900;
    font-size: 20px;
    border-radius: 8px;
    transition: left 0.3s ease;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .ant-typography {
    color: white;
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 800;
  }

  /* ================= MOBILE ================= */
  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: -300px;
    width: 300px;
    height: 100vh;
    background: #2c50a5;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 850;

    display: flex;
    flex-direction: column;

    &.open {
      left: 0;
    }

    @media (min-width: 768px) {
      display: none;
    }

    .ant-menu {
      flex: 1;
      border-inline-end: none;
      background: transparent;
      color: #fff;
    }

    .logout-wrapper {
      border-top: 1px solid rgba(255, 255, 255, 0.25);
    }

    .ant-menu-item,
    .ant-menu-submenu-title,
    .anticon {
      color: #fff !important;
    }

    .ant-menu-item-selected {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .ant-menu-item:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }

  /* ================= DESKTOP ================= */
  .desktop-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 300px;
    height: 100vh;
    background: #2c50a5;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 850;

    display: none;
    flex-direction: column;

    @media (min-width: 768px) {
      display: flex;
    }

    .ant-menu {
      flex: 1;
      border-inline-end: none;
      background: transparent;
      color: #fff;
    }

    .logout-wrapper {
      border-top: 1px solid rgba(255, 255, 255, 0.25);
    }

    .ant-menu-item,
    .ant-menu-submenu-title,
    .anticon {
      color: #fff !important;
    }

    .ant-menu-item-selected {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .ant-menu-item:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }
  }
`;

export default SidebarStyles;
