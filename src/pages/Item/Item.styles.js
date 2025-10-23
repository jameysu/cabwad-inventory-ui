import styled from "styled-components";

const ItemStyles = styled.div`
  padding: 16px;
  background-color: #f7f8fa;
  height: 100%;
  overflow-y: auto;

  .ant-flex.search-container {
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;

    @media (max-width: 425px) {
      flex-direction: column;
      align-items: stretch;
    }

    .search-input {
      width: 280px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

      @media (max-width: 425px) {
        width: 100% !important;
      }
    }

    .ant-btn-primary {
      border-radius: 8px;
      font-weight: 600;
      height: 40px;
    }
  }

  .ant-table {
    background: #fff;
    border-radius: 14px;
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
    transition: background 0.2s ease;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f9f9f9;
  }

  .ant-table-cell[align="center"] {
    text-align: center !important;
  }

  .ant-pagination {
    margin-top: 20px;
  }

  .mobile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .mobile-card {
    background: #fff;
    border-radius: 14px;
    padding: 16px 18px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
    transition: all 0.25s ease-in-out;
    border: 1px solid #f0f0f0;
    position: relative;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
    }

    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f1f1f;
      }

      .dropdown-btn {
        color: #555;
      }
    }

    .brand {
      color: #777;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 4px;
      color: #555;

      strong {
        color: #000;
      }
    }

    .stock-info {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .in {
        color: #52c41a;
        font-weight: 600;
      }
      .out {
        color: #ff4d4f;
        font-weight: 600;
      }
    }

    .price {
      font-weight: 600;
      color: #1677ff;
      font-size: 15px;
      margin-top: 6px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export default ItemStyles;
