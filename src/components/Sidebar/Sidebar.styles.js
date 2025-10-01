import styled from "styled-components";

const SidebarStyles = styled.div`
  /* Hamburger Button */
  .menu-btn {
    position: fixed;
    top: 15px;
    left: ${({ $open }) => ($open ? "220px" : "15px")};
    z-index: 1100;
    font-size: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: left 0.3s ease;

    @media (min-width: 768px) {
      display: none;
    }
  }

  .mobile-sidebar {
    position: fixed;
    top: 0;
    left: -220px;
    width: 220px;
    height: 100vh;
    background: #2c50a5;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 1000;

    &.open {
      left: 0;
    }

    .ant-menu {
      height: 100%;
      border-inline-end: none;
      background: transparent;
      color: #fff;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      color: #fff !important;
    }

    .ant-menu-submenu-arrow {
      color: #fff !important;
    }

    .ant-menu-item-selected {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .ant-menu-item:hover,
    .ant-menu-submenu-title:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .anticon {
      color: #fff !important;
    }
  }

  .desktop-sidebar {
    display: none;
    height: 100vh;
    width: 220px;
    position: fixed;
    top: 0;
    left: 0;
    background: #2c50a5;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);

    .ant-menu {
      height: 100%;
      border-inline-end: none;
      background: transparent;
      color: #fff;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      color: #fff !important;
    }

    .ant-menu-submenu-arrow {
      color: #fff !important;
    }

    .ant-menu-item-selected {
      background-color: rgba(255, 255, 255, 0.2) !important;
    }

    .ant-menu-item:hover,
    .ant-menu-submenu-title:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    .anticon {
      color: #fff !important;
    }

    @media (min-width: 768px) {
      display: block;
    }
  }
`;

export default SidebarStyles;
