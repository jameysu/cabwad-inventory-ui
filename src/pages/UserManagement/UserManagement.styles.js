import styled from "styled-components";

const UserManagementStyled = styled.div`
  padding: 16px;
  background-color: #f7f8fa;
  height: 100%;
  overflow-y: auto;

  .header-actions {
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .ant-table {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .user-card {
    border-radius: 14px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    padding: 18px 20px;
    background-color: #fff;
    transition: all 0.25s ease;
    animation: fadeIn 0.25s ease-in;
    position: relative;

    &:hover {
      box-shadow: 0 5px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-3px);
    }

    .username {
      font-size: 17px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .detail {
      margin: 0 0 6px 0;
      color: #595959;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      b {
        color: #2f3542;
        font-weight: 500;
      }
    }

    .divider {
      height: 1px;
      background-color: #f0f0f0;
      margin: 8px 0;
    }

    .actions {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      button {
        border-radius: 8px;
        min-width: 70px;
        font-size: 13px;
        font-weight: 500;
        color: white;

        &.ant-btn-primary {
          background-color: #1677ff;
          border-color: #1677ff;

          &:hover {
            background-color: #4096ff;
          }
        }

        &.ant-btn-dangerous {
          background-color: #ff4d4f;
          border-color: #ff4d4f;
        }
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
`;

export default UserManagementStyled;
