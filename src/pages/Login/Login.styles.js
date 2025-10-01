import { memo } from "react";
import styled from "styled-components";
import bgImage from "../../assets/images/bg3.jpg";

const LoginWrapper = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  text-align: center;
  padding: 20px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
      url(${bgImage});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 0;
  }
  > * {
    position: relative;
    z-index: 1;
  }

  .ant-form {
    max-width: 100%;
    width: 400px;
    background: #f8fbff;
    padding: 30px;
    border-radius: 10px;

    .ant-btn {
      width: 50%;
      height: 40px;

      @media (max-width: 320px) {
        width: 100%;
      }
    }
  }
`;

export default memo(LoginWrapper);
