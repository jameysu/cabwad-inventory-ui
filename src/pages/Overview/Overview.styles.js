import styled from "styled-components";

const OverviewStyle = styled.div`
  padding: 12px;

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }

  .overview-card {
    border-radius: 14px;
    color: #fff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 35px rgba(0, 0, 0, 0.12);
    }

    .icon-wrapper {
      font-size: 42px;
      background: rgba(255, 255, 255, 0.2);
      padding: 14px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label {
      color: rgba(255, 255, 255, 0.85);
      font-size: 14px;
    }

    .value {
      margin: 0;
      color: #fff;
      font-weight: 600;
    }
  }

  .inventory-cost {
    background: linear-gradient(135deg, #5b6ef5, #8ea2ff);
  }

  .items-out-cost {
    background: linear-gradient(135deg, #f97316, #fbbf24);
  }

  .total-product {
    background: linear-gradient(135deg, #22c55e, #86efac);
  }
`;

export default OverviewStyle;
