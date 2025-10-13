import styled from "styled-components";

const PortalStyle = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 0 !important;

  @media (min-width: 768px) {
    margin-left: 300px !important;
  }

  .topbar {
    height: 60px;
    border-bottom: 1px solid #e3e5e9ff;
    display: flex;
    justify-content: flex-end;
  }
`;

export default PortalStyle;
