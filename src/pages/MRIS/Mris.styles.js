import styled from "styled-components";

const MrisStyles = styled.div`
  padding: 16px;
  overflow: auto;
  background-color: #f7f8fa;
  height: 100%;

  .header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;

    .title {
      margin: 0;
      color: #1f1f1f;
    }
  }

  .ant-table {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }

  .ant-table-thead > tr > th {
    background: #f0f2f5 !important;
    color: #1f1f1f;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #e8e8e8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px !important;
    font-size: 14px;
    color: #333;
  }

  .mobile-cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .mobile-card {
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    padding: 16px 18px;
    transition: all 0.25s ease-in-out;
    border: 1px solid #f0f0f0;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .item-name {
      font-size: 16px;
      font-weight: 600;
      color: #1f1f1f;
    }

    .badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge.stock-in {
      background: #52c41a;
    }
    .badge.stock-out {
      background: #ff4d4f;
    }
    .badge.return {
      background: #1677ff;
    }

    .card-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 14px;
      color: #555;

      strong {
        color: #000;
      }
    }
  }

  @media (max-width: 480px) {
    .ant-modal {
      width: 95% !important;
      padding: 12px;
    }

    .ant-picker,
    .ant-select {
      width: 100% !important;
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
  }
`;

export default MrisStyles;
