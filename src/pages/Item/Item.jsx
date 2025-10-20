import React, { useState } from "react";
import ItemStyles from "./Item.styles";
import { Button, Dropdown, Flex, Input, Space, Table, message } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import ItemModal from "./ItemModal";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useGetItemsQuery } from "../../services/itemApi";

const { Search } = Input;

const Item = () => {
  const { data: fetchItemSuccess } = useGetItemsQuery();

  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItems] = useState([
    {
      key: "3",
      item: "PVC Pipe",
      brand: "Brand X",
      type: "PVC",
      size: "1 inch",
      price: "P10.00",
      stock_in: 200,
      stock_out: 30,
    },
  ]);

  const handleAdd = () => {
    setIsEditMode(false);
    setSelectedItem(null);
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setIsEditMode(true);
    setSelectedItem(record);
    setOpenModal(true);
  };

  const handleSave = (newItem) => {
    if (isEditMode) {
      setItems((prev) =>
        prev.map((item) => (item.key === newItem.key ? newItem : item))
      );
    } else {
      setItems((prev) => [
        ...prev,
        { ...newItem, key: String(prev.length + 1) },
      ]);
    }
    setOpenModal(false);
  };

  const handleExportSinglePDF = async (record) => {
    try {
      const doc = new jsPDF();
      const qrData = await QRCode.toDataURL(record.key);

      doc.setFontSize(16);
      doc.text("Item Details", 20, 20);

      doc.setFontSize(12);
      doc.text(`Item ID: ${record.key}`, 20, 35);
      doc.text(`Name: ${record.item}`, 20, 45);
      doc.text(`Type: ${record.type}`, 20, 55);
      doc.text(`Size: ${record.size}`, 20, 65);
      doc.text(`Price: ${record.price}`, 20, 75);

      doc.addImage(qrData, "PNG", 120, 20, 70, 70);

      doc.save(`${record.item.replace(/\s+/g, "_")}_QR.pdf`);
    } catch (error) {
      console.error(error);
      message.error("Failed to generate PDF");
    }
  };

  const handleDelete = (record) => {
    setItems((prev) => prev.filter((item) => item.key !== record.key));
    message.success(`${record.item} deleted successfully`);
  };

  const columns = [
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock In", dataIndex: "stock_in", key: "stock_in" },
    { title: "Stock Out", dataIndex: "stock_out", key: "stock_out" },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          {
            key: "update",
            label: "Update",
            onClick: () => handleEdit(record),
          },
          {
            key: "export",
            label: "Export QR",
            onClick: () => handleExportSinglePDF(record),
          },
          {
            key: "delete",
            label: "Delete",
            onClick: () => handleDelete(record),
          },
        ];

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button icon={<MenuOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <ItemStyles>
      <Flex
        gap={20}
        align="center"
        style={{ marginBottom: 16, flexWrap: "wrap" }}
      >
        <Search placeholder="Search item" style={{ width: 250 }} allowClear />
        <Button type="primary" onClick={handleAdd}>
          Add Item
        </Button>
      </Flex>

      <Table dataSource={items} columns={columns} pagination={false} />

      <ItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={handleSave}
        itemData={selectedItem}
        isEditMode={isEditMode}
      />
    </ItemStyles>
  );
};

export default Item;
