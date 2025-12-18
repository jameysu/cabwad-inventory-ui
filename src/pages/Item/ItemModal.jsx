import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import {
  useCreateItemMutation,
  useUpdateItemMutation,
} from "../../services/itemApi";

const ItemModal = ({ open, onClose, selectedItem, refetch }) => {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);

  const [createItem, { isLoading: createItemLoading }] =
    useCreateItemMutation();
  const [updateItem, { isLoading: updateItemLoading }] =
    useUpdateItemMutation();

  useEffect(() => {
    if (selectedItem) {
      setIsEditMode(true);
      form.setFieldsValue(selectedItem);
    } else {
      setIsEditMode(false);
      form.resetFields();
    }
  }, [selectedItem, form]);

  const handleSave = async (values) => {
    const user = JSON.parse(localStorage.getItem("identity"));
    const payload = {
      user_id: user.userid,
      description: values.item,
      brand: values.brand,
      category: values.category,
      size: values.size,
      amount: values.price,
      stockin: values.stock_in,
      stockout: values.stock_out,
    };

    const hide = message.loading(
      isEditMode ? "Updating item..." : "Saving item...",
      0
    );

    try {
      let response;
      if (isEditMode && selectedItem?.key) {
        response = await updateItem({
          id: selectedItem.key,
          quantity: selectedItem.quantity,
          ...payload,
        }).unwrap();
        form.resetFields();
      } else {
        response = await createItem(payload).unwrap();
        form.resetFields();
      }

      hide();
      if (response?.success === false) {
        message.error(response.message || "Operation failed");
      } else {
        message.success(
          isEditMode ? "Item updated successfully" : "Item added successfully"
        );
        onClose();
        refetch();
      }
    } catch (error) {
      hide();
      console.error("Item save failed:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to save item. Please try again."
      );
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => handleSave(values))
      .catch(() => {});
  };

  return (
    <Modal
      open={open}
      centered
      title={isEditMode ? "Edit Item" : "Add Item"}
      okText={isEditMode ? "Update" : "Add"}
      confirmLoading={createItemLoading || updateItemLoading}
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
          name="brand"
          label="Brand"
          rules={[{ required: true, message: "Please enter brand" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please enter category" }]}
        >
          <Input />
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
          <Input addonBefore="₱" />
        </Form.Item>

        {isEditMode && (
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter item quantity" }]}
          >
            <Input />
          </Form.Item>
        )}

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
