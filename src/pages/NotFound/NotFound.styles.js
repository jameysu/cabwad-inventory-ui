import styled from "styled-components";

const NotFoundStyles = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  padding: 20px;
  overflow: hidden;

  .glitch-title {
    font-size: 8rem;
    font-weight: 800;
    color: #fff;
    position: relative;
    text-transform: uppercase;
    animation: glitch 1s infinite;
    line-height: 1;
    margin-bottom: 10px;
  }

  .subtitle {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 10px;
  }

  .ant-btn {
    border-radius: 8px;
    background: linear-gradient(135deg, #0077cc, #005fa3);
    border: none;
    transition: all 0.3s ease;
    font-weight: 600;

    &:hover {
      background: linear-gradient(135deg, #005fa3, #003f73);
      transform: translateY(-2px);
    }
  }

  /* Glitch animation */
  @keyframes glitch {
    0% {
      text-shadow: 2px 2px #ff00c1, -2px -2px #00fff9;
    }
    25% {
      text-shadow: -2px -2px #ff00c1, 2px 2px #00fff9;
    }
    50% {
      text-shadow: 2px -2px #ff00c1, -2px 2px #00fff9;
    }
    75% {
      text-shadow: -2px 2px #ff00c1, 2px -2px #00fff9;
    }
    100% {
      text-shadow: 2px 2px #ff00c1, -2px -2px #00fff9;
    }
  }

  @media (max-width: 600px) {
    .glitch-title {
      font-size: 4rem;
    }
    .subtitle {
      font-size: 1rem;
    }
  }
`;

export default NotFoundStyles;
