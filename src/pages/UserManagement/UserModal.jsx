import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../../services/authApi";

const { Option } = Select;

const UserModal = ({ open, onCancel, selectedUser }) => {
  const [form] = Form.useForm();
  const [addUser, { isLoading: adding }] = useAddUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const isEdit = Boolean(selectedUser);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        username: selectedUser.username,
        email: selectedUser.email,
        password: "",
        usertype: String(selectedUser.usertype), // ✅ correct value
      });
    } else {
      form.resetFields();
    }
  }, [selectedUser, isEdit, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (isEdit) {
        const data = {
          userid: selectedUser.key,
          ...values,
        };

        await updateUser(data).unwrap();
        message.success("User updated successfully!");
      } else {
        await addUser(values).unwrap();
        message.success("User added successfully!");
      }
      onCancel();
      form.resetFields();
    } catch (error) {
      console.log(error);
      message.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Update User" : "Add User"}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={adding || updating}
      okText={isEdit ? "Update" : "Add"}
      centered
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter username" }]}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Enter a valid email" },
          ]}
          style={{ marginBottom: 5 }}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Please enter password" }]}
          style={{ marginBottom: 5 }}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          name="usertype"
          label="User Type"
          rules={[{ required: true, message: "Please select user type" }]}
          style={{ marginBottom: 5 }}
        >
          <Select disabled={isEdit} placeholder="Select user type">
            <Option value="1">ADMIN</Option>
            <Option value="2">ENGINEER</Option>
            <Option value="3">INVENTORY</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
