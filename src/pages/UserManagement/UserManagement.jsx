import React, { useState, useMemo } from "react";
import UserManagementStyled from "./UserManagement.styles";
import { Table, Button, Space, Input, Flex, Card, Spin, message } from "antd";
import { Grid } from "antd";
import { useGetUsersQuery } from "../../services/authApi";
import UserModal from "./UserModal";

const { Search } = Input;
const { useBreakpoint } = Grid;

const UserManagement = () => {
  const {
    data: getUserSuccess,
    isLoading: getUsersLoading,
    isError: getUsersFailed,
    refetch,
  } = useGetUsersQuery();

  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const screens = useBreakpoint();

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpenModal(true);
  };

  const handleUpdate = (record) => {
    setSelectedUser(record);
    setOpenModal(true);
  };

  const handleDelete = (record) => {
    console.log("Delete user:", record);
    message.info("Delete API to be implemented");
  };

  const handleSearch = (value) => setSearchText(value.toLowerCase());

  const users = useMemo(() => {
    if (getUserSuccess?.success && Array.isArray(getUserSuccess.users)) {
      return getUserSuccess.users.map((user) => ({
        key: user.id,
        username: user.username,
        email: user.email,
        usertypename: user.usertypename || "N/A",
        usertype: user.usertype,
        createdAt: user.createdAt,
      }));
    }
    return [];
  }, [getUserSuccess]);

  const filteredData = users.filter(
    (item) =>
      item.username.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.usertypename.toLowerCase().includes(searchText)
  );

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "User Type", dataIndex: "usertypename", key: "usertypename" },
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

  if (getUsersLoading)
    return (
      <Flex justify="center" align="center" style={{ minHeight: "60vh" }}>
        <Spin size="large" />
      </Flex>
    );

  if (getUsersFailed) {
    message.error("Failed to fetch users");
    return <p style={{ textAlign: "center" }}>Failed to load users.</p>;
  }

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
        <Flex vertical gap={16}>
          {filteredData.map((user) => (
            <Card key={user.key} size="small" bordered className="user-card">
              <p className="username">{user.username}</p>
              <p className="detail">
                <b>Email:</b> {user.email}
              </p>
              <p className="detail">
                <b>User Type:</b> {user.usertypename}
              </p>
              <div className="actions">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleUpdate(user)}
                >
                  Update
                </Button>
                <Button danger size="small" onClick={() => handleDelete(user)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </Flex>
      )}

      <UserModal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        selectedUser={selectedUser}
        refetch={refetch}
      />
    </UserManagementStyled>
  );
};

export default UserManagement;
