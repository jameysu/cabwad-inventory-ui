import styled from "styled-components";

const PortalStyle = styled.div`
  flex: 1;
  padding: 20px;
  margin-left: 0 !important; /* default: mobile & tablet */

  @media (min-width: 768px) {
    margin-left: 220px !important; /* only desktop and up */
  }
`;

export default PortalStyle;
