import styled from "styled-components";

const PortalStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 0 !important; /* default: mobile & tablet */

  @media (min-width: 768px) {
    margin-left: 300px !important; /* only desktop and up */
  }

  .topbar {
    height: 50px;
    border-bottom: 1px solid #dadde2ff;
    display: flex;
    justify-content: flex-end;
  }
`;

export default PortalStyle;
