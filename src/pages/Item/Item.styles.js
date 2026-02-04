import styled from "styled-components";

const ItemStyles = styled.div`
  padding: 16px;
  background-color: #f5f6fa;
  height: 100%;
  overflow-y: auto;

  /* ================= SEARCH / ACTION BAR ================= */
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
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

      @media (max-width: 768px) {
        width: 100% !important;
      }
    }

    .ant-btn-primary {
      border-radius: 10px;
      font-weight: 600;
      height: 40px;
    }
  }

  /* ================= TABLE WRAPPER ================= */
  .ant-table {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
    overflow: hidden;
  }

  /* ================= TABLE HEADER ================= */
  .ant-table-thead > tr > th {
    background: linear-gradient(180deg, #fafafa, #f0f2f5) !important;
    color: #1f2937;
    font-weight: 700;
    font-size: 13px;
    padding: 14px 16px !important;
    border-bottom: 1px solid #e5e7eb;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* ================= TABLE BODY ================= */
  .ant-table-tbody > tr > td {
    padding: 14px 16px !important;
    font-size: 14px;
    color: #374151;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s ease;
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  /* ================= ROW HOVER ================= */
  .ant-table-tbody > tr:hover > td {
    background-color: #f9fafb;
  }

  /* ================= CENTER ALIGN FIX ================= */
  .ant-table-cell[align="center"] {
    text-align: center !important;
  }

  /* ================= PAGINATION ================= */
  .ant-pagination {
    margin-top: 20px;
    padding: 0 8px;
  }

  /* ================= MOBILE GRID ================= */
  .mobile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }

  .mobile-card {
    background: #ffffff;
    border-radius: 16px;
    padding: 16px 18px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.25s ease-in-out;
    border: 1px solid #f0f0f0;
    position: relative;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    }

    .mobile-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;

      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #111827;
      }

      .dropdown-btn {
        color: #6b7280;
      }
    }

    .brand {
      color: #6b7280;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 4px;
      color: #4b5563;

      strong {
        color: #111827;
      }
    }

    .stock-info {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .in {
        color: #22c55e;
        font-weight: 700;
      }

      .out {
        color: #ef4444;
        font-weight: 700;
      }
    }

    .price {
      font-weight: 700;
      color: #2563eb;
      font-size: 15px;
      margin-top: 6px;
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export default ItemStyles;
