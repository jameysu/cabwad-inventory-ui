import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div>
      <Button onClick={logout}>Log out</Button>
    </div>
  );
};

export default Dashboard;
