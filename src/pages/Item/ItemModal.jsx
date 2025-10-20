import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const ItemModal = ({ open, onClose, onSave, itemData, isEditMode }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode && itemData) {
      form.setFieldsValue(itemData);
    } else {
      form.resetFields();
    }
  }, [itemData, isEditMode, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSave({
          ...itemData,
          ...values,
        });
        form.resetFields();
      })
      .catch(() => {});
  };

  return (
    <Modal
      open={open}
      title={isEditMode ? "Edit Item" : "Add Item"}
      okText={isEditMode ? "Update" : "Add"}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="item"
          label="Item Name"
          rules={[{ required: true, message: "Please enter item name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select item type" }]}
        >
          <Select
            placeholder="Select item type"
            options={[
              { value: "PVC", label: "PVC" },
              { value: "GJ", label: "GJ" },
              { value: "BRASS", label: "BRASS" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="size"
          label="Size"
          rules={[{ required: true, message: "Please enter item size" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter item price" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="stock_in"
          label="Stock In"
          rules={[{ required: true, message: "Please enter stock in" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="stock_out"
          label="Stock Out"
          rules={[{ required: true, message: "Please enter stock out" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ItemModal;
