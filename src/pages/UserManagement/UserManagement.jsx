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
  Typography,
} from "antd";
import { Grid } from "antd";
import {
  useGetUsersQuery,
  useLockUnlockAllUsersMutation,
  useLockUnlockUserMutation,
  useDeleteUserMutation,
} from "../../services/authApi";
import UserModal from "./UserModal";
import { UserOutlined } from "@ant-design/icons";

const { Search } = Input;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const UserManagement = () => {
  const { data, isLoading, isError } = useGetUsersQuery();

  const [lockUnlockAllUsers, { isLoading: isLockingAll }] =
    useLockUnlockAllUsersMutation();

  const [lockUnlockUser, { isLoading: isLockingUser }] =
    useLockUnlockUserMutation();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const screens = useBreakpoint();

  const identityJson = JSON.parse(localStorage.getItem("identity"));

  const users = useMemo(() => {
    if (data?.success && Array.isArray(data.users)) {
      return data.users.map((user) => ({
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
  }, [data]);

  const filteredData = users.filter(
    (item) =>
      item.username.toLowerCase().includes(searchText) ||
      item.email.toLowerCase().includes(searchText) ||
      item.usertypename.toLowerCase().includes(searchText),
  );

  const handleDelete = async (record) => {
    try {
      await deleteUser({
        userid: record.key,
        currentuserid: identityJson.userid,
      }).unwrap();

      message.success(`User "${record.username}" deleted successfully`);
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete user");
    }
  };

  const handleLockUnlockAll = async (isLockOrUnlock) => {
    try {
      await lockUnlockAllUsers({
        currentuserid: identityJson.userid,
        isLockOrUnlock,
      }).unwrap();

      message.success("User lock state updated successfully");
    } catch (error) {
      message.error(error?.data?.message || "Failed to update users");
    }
  };

  const handleLockUnlockUser = async (record) => {
    try {
      await lockUnlockUser({
        userid: record.key,
        currentuserid: identityJson.userid,
      }).unwrap();

      message.success(
        `User "${record.username}" ${
          record.ishidden ? "unlocked" : "locked"
        } successfully`,
      );
    } catch (error) {
      message.error(error?.data?.message || "Failed to update user");
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "User Type", dataIndex: "usertypename" },
    {
      title: "Status",
      dataIndex: "ishidden",
      render: (_, record) => (
        <Text type={record.ishidden ? "danger" : "success"}>
          {record.ishidden ? "Locked" : "Unlocked"}
        </Text>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setSelectedUser(record);
              setOpenModal(true);
            }}
          >
            Update
          </Button>

          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
            onConfirm={() => handleDelete(record)}
          >
            <Button danger loading={isDeleting}>
              Delete
            </Button>
          </Popconfirm>

          <Button
            type="primary"
            loading={isLockingUser}
            onClick={() => handleLockUnlockUser(record)}
          >
            {record.ishidden ? "Unlock" : "Lock"}
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading)
    return (
      <Spin tip="Loading...">
        <div style={{ height: "80vh" }} />
      </Spin>
    );

  if (isError) return <Text type="danger">Failed to load users.</Text>;

  return (
    <UserManagementStyled>
      <Flex gap={10} className="header-actions">
        <Search
          placeholder="Search users"
          allowClear
          onChange={(e) => setSearchText(e.target.value.toLowerCase())}
          style={{ width: 250 }}
        />

        <Button type="primary" onClick={() => setOpenModal(true)}>
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
        <Table columns={columns} dataSource={filteredData} />
      ) : (
        <Flex vertical gap={16}>
          {filteredData.map((user) => (
            <Card key={user.key}>
              <Flex gap={12}>
                <Avatar icon={<UserOutlined />} />
                <div>
                  <p>
                    <strong>{user.username}</strong>
                  </p>
                  <p>{user.email}</p>
                  <p>{user.usertypename}</p>
                  <Text type={user.ishidden ? "danger" : "success"}>
                    {user.ishidden ? "Locked" : "Unlocked"}
                  </Text>
                </div>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}

      <UserModal
        open={openModal}
        selectedUser={selectedUser}
        onCancel={() => setOpenModal(false)}
      />
    </UserManagementStyled>
  );
};

export default UserManagement;
