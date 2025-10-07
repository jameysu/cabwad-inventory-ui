import styled from "styled-components";

const OverviewStyle = styled.div`
  flex: 1;
  padding: 10px;

  .ant-flex {
    // @media (max-width: 768px) {
    //   flex-direction: column;
    // }
    .ant-card {
      // flex: 1 1 200px;
      max-width: 100%;

      &.inventory-cost {
        background: linear-gradient(to bottom, #9da9d9, #c8d9f9);
      }
    }
  }
`;

export default OverviewStyle;
