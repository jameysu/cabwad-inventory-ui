import { memo } from "react";
import styled from "styled-components";

const LoginWrapper = styled.div`
  width: 100%;

  .ant-flex {
    &.topbar {
      background: #5c77b2;
      padding: 10px 20px;
    }

    &.cabwad-text {
      .ant-typography {
        color: white;
      }
    }

    &.login-form {
      padding: 10px;

      .image-wrapper {
        position: relative;
        display: inline-block;
        max-width: 60%;
        width: 60%;

        @media (max-width: 768px) {
          display: none;
        }

        .ribbon-cutting-img {
          display: block;
          width: 100%;
          height: 100%;
          outline: none;
          opacity: 0.7;
        }
      }

      .image-wrapper::after {
        content: "";
        position: absolute;
        inset: 0;
        linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5))
      }

      .ant-form {
        background: #eaf5fa;
        max-width: 40%;
        width: 40%;
        display: flex;
        gap: 10px;
        flex-direction: column;

        @media (max-width: 768px) {
          max-width: 100%;
          width: 100%;
        }

        .ant-flex {
          padding: 20px;

          .ant-btn {
            width: 100%;
          }
        }

        .pipe-img {
          opacity: 0.7;
        }
      }
    }
  }
`;

export default memo(LoginWrapper);
