import styled from "styled-components";
import bgImage from "../../assets/images/bg3.jpg";

const LoginStyles = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
  overflow: hidden;

  /* Background with gradient + blur */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      url(${bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(2px);
    transform: scale(1.05);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .ant-form {
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.95);
    padding: 40px 35px;
    border-radius: 16px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(6px);
    transition: all 0.3s ease;
    text-align: center;

    .ant-image {
      margin-bottom: 12px;
    }

    .ant-typography {
      margin-bottom: 25px;
      color: #003366;
      font-weight: 600;
    }

    .ant-input {
      border-radius: 8px;
      padding: 10px;
    }

    .ant-btn {
      width: 100%;
      height: 45px;
      margin-top: 10px;
      border-radius: 8px;
      background: linear-gradient(135deg, #0077cc, #005fa3);
      border: none;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        background: linear-gradient(135deg, #005fa3, #003f73);
      }
    }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .ant-form {
      padding: 25px 20px;
      border-radius: 12px;
    }

    .ant-typography {
      font-size: 1.2rem;
    }
  }
`;

export default LoginStyles;
