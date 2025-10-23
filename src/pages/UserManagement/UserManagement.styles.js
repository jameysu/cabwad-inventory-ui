import styled from "styled-components";

const UserManagementStyled = styled.div`
  padding: 16px;
  overflow: auto;
  background-color: #fafafa;
  height: 100%;

  .header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .ant-table {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .user-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    padding: 14px 16px;
    background-color: #fff;
    transition: all 0.2s ease-in-out;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .username {
      font-size: 16px;
      font-weight: 600;
      color: #1f1f1f;
      margin-bottom: 4px;
    }

    .detail {
      margin: 0 0 6px 0;
      color: #555;
      font-size: 14px;

      b {
        color: #333;
      }
    }

    .actions {
      margin-top: 8px;
      display: flex;
      gap: 8px;

      button {
        border-radius: 6px;
      }
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .user-card {
    animation: fadeIn 0.2s ease-in;
  }
`;

export default UserManagementStyled;
