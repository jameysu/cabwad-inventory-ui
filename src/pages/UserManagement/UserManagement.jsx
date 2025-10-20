import React, { useState } from "react";
import UserManagementStyled from "./UserManagement.styles";
import { Table, Button, Space, Input, Flex, Card } from "antd";
import { Grid } from "antd";

const { Search } = Input;
const { useBreakpoint } = Grid;

const UserManagement = () => {
  const [data, setData] = useState([
    {
      key: "1",
      username: "johndoe",
      usertype: "admin",
      email: "johndoe@example.com",
    },
    {
      key: "2",
      username: "janesmith",
      usertype: "editor",
      email: "janesmith@example.com",
    },
    {
      key: "3",
      username: "mikebrown",
      usertype: "viewer",
      email: "mikebrown@example.com",
    },
    {
      key: "4",
      username: "sarahlee",
      usertype: "admin",
      email: "sarahlee@example.com",
    },
    {
      key: "5",
      username: "davidkim",
      usertype: "editor",
      email: "davidkim@example.com",
    },
  ]);

  const [searchText, setSearchText] = useState("");
  const screens = useBreakpoint();

  const handleUpdate = (record) => console.log("Update user:", record);
  const handleDelete = (record) => console.log("Delete user:", record);
  const handleAddUser = () => console.log("Add user clicked");

  const handleSearch = (value) => setSearchText(value.toLowerCase());

  const filteredData = data.filter(
    (item) =>
      item.username.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.usertype.toLowerCase().includes(searchText)
  );

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "User Type", dataIndex: "usertype", key: "usertype" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <UserManagementStyled>
      <Flex gap={20} align="center" style={{ marginBottom: 16 }}>
        <Search
          placeholder="Search users"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Button type="primary" onClick={handleAddUser}>
          Add User
        </Button>
      </Flex>

      {screens.md ? (
        <Table dataSource={filteredData} columns={columns} pagination={false} />
      ) : (
        <Flex vertical gap={12}>
          {filteredData.map((user) => (
            <Card key={user.key} size="small">
              <p>
                <b>Username:</b> {user.username}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>User Type:</b> {user.usertype}
              </p>
              <Space>
                <Button type="primary" onClick={() => handleUpdate(user)}>
                  Update
                </Button>
                <Button danger onClick={() => handleDelete(user)}>
                  Delete
                </Button>
              </Space>
            </Card>
          ))}
        </Flex>
      )}
    </UserManagementStyled>
  );
};

export default UserManagement;
