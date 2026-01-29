import React, { useState, useMemo } from "react";
import UserManagementStyled from "./UserManagement.styles";
import {
  Table,
  Button,
  Space,
  Input,
  Flex,
  Card,
  Spin,
  message,
  Avatar,
  Popconfirm,
} from "antd";
import { Grid } from "antd";
import {
  useGetUsersQuery,
  useLockUnlockAllUsersMutation,
} from "../../services/authApi";
import UserModal from "./UserModal";
import { UserOutlined } from "@ant-design/icons";

const { Search } = Input;
const { useBreakpoint } = Grid;

const UserManagement = () => {
  const {
    data: getUserSuccess,
    isLoading: getUsersLoading,
    isError: getUsersFailed,
    refetch,
  } = useGetUsersQuery();

  const [lockUnlockAllUsers, { isLoading: isLockingAll }] =
    useLockUnlockAllUsersMutation();

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
    console.log("record", record);
    setOpenModal(true);
  };

  const handleDelete = (record) => {
    console.log("Delete user:", record);
    message.success(`User "${record.username}" deleted successfully`);
  };

  const handleSearch = (value) => setSearchText(value.toLowerCase());

  const users = useMemo(() => {
    if (getUserSuccess?.success && Array.isArray(getUserSuccess.users)) {
      return getUserSuccess.users.map((user) => ({
        key: user.id,
        username: user.username,
        email: user.email,
        usertypename: user.usertypename || "N/A",
        ishidden: user.ishidden,
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
      item.usertypename.toLowerCase().includes(searchText),
  );

  const handleLockUnlockAll = async (isLockOrUnlock) => {
    try {
      const identity = localStorage.getItem("identity");
      const identityJson = JSON.parse(identity);
      console.log(identityJson);

      await lockUnlockAllUsers({
        currentuserid: identityJson.userid,
        isLockOrUnlock,
      }).unwrap();

      message.success("User lock state updated successfully");
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to lock/unlock all users");
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "User Type", dataIndex: "usertypename", key: "usertypename" },
    {
      title: "Status",
      dataIndex: "ishidden",
      key: "ishidden",
      render: (_, record) => (
        <span
          style={{
            color: record.ishidden ? "#cf1322" : "#389e0d",
            fontWeight: 500,
          }}
        >
          {record.ishidden ? "Locked" : "Unlocked"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            description={`This action cannot be undone.`}
            okText="Yes, delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
          <Button type="primary">
            {record.ishidden ? "Lock User" : "Unlock User"}
          </Button>
        </Space>
      ),
    },
  ];

  if (getUsersLoading)
    return (
      <Spin tip="Loading...">
        <div style={{ height: "80vh" }} />
      </Spin>
    );
  if (getUsersFailed) return <Text type="danger">Failed to load users.</Text>;

  return (
    <UserManagementStyled>
      <Flex className="header-actions" gap={10}>
        <Search
          placeholder="Search users"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ width: "250px" }}
        />
        <Button type="primary" onClick={handleAddUser}>
          Add User
        </Button>
        <Button
          type="primary"
          loading={isLockingAll}
          onClick={() => handleLockUnlockAll(true)}
        >
          Lock Users
        </Button>
        <Button
          type="primary"
          loading={isLockingAll}
          onClick={() => handleLockUnlockAll(false)}
        >
          Unlock Users
        </Button>
      </Flex>

      {screens.md ? (
        <Table dataSource={filteredData} columns={columns} pagination={false} />
      ) : (
        <Flex vertical gap={16}>
          {filteredData.map((user) => (
            <Card key={user.key} size="small" className="user-card">
              <Flex align="center" gap={12}>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <p className="username">{user.username}</p>
                  <p className="detail">
                    <strong>Email: </strong> {user.email}
                  </p>
                  <p className="detail">
                    <strong>User Type: </strong>
                    {user.usertypename}
                  </p>
                  <p className="detail">
                    <p className="detail">
                      <strong>Status: </strong>{" "}
                      <span
                        style={{
                          color: user.ishidden ? "#cf1322" : "#389e0d",
                          fontWeight: 500,
                        }}
                      >
                        {user.ishidden ? "Locked" : "Unlocked"}
                      </span>
                    </p>
                  </p>
                </div>
              </Flex>
              <div className="divider" />
              <div className="actions">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleUpdate(user)}
                >
                  Update
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this user?"
                  description="This action cannot be undone."
                  okText="Yes, delete"
                  cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDelete(user)}
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
                <Button type="primary">Lock User</Button>
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
