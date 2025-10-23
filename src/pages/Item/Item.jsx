import React, { useMemo, useState, useEffect } from "react";
import ItemStyles from "./Item.styles";
import {
  Button,
  Dropdown,
  Flex,
  Input,
  Table,
  message,
  Card,
  Typography,
  Spin,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ItemModal from "./ItemModal";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useGetItemsQuery } from "../../services/itemApi";

const { Search } = Input;
const { Text, Title } = Typography;

const Item = () => {
  const {
    data: fetchItemSuccess,
    isLoading: fetchItemLoading,
    isError: fetchItemFailed,
    refetch,
  } = useGetItemsQuery();

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");

  const items = useMemo(() => {
    if (!fetchItemSuccess?.items) return [];
    return fetchItemSuccess.items.map((i) => ({
      key: i.id,
      item: i.description,
      brand: i.brand,
      category: i.category,
      size: i.size,
      price: i.amount,
      quantity: i.quantity,
      stock_in: i.stockin,
      stock_out: i.stockout,
      stock_return: i.return,
      added_by: i.added_by,
      createdAt: i.createdAt,
    }));
  }, [fetchItemSuccess]);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    return items.filter((i) =>
      [i.item, i.brand, i.category]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, items]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAdd = () => {
    setSelectedItem(null);
    setOpenModal(true);
  };

  const handleEdit = (record) => {
    setSelectedItem(record);
    setOpenModal(true);
  };

  const handleExportSinglePDF = async (record) => {
    try {
      const itemId = record.key || record.id || record.item || "Unknown_Item";
      const qrData = await QRCode.toDataURL(String(itemId));

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Item Details", 20, 20);
      doc.setFontSize(12);
      doc.text(`Name: ${record.item || "N/A"}`, 20, 35);
      doc.text(`Category: ${record.category || "N/A"}`, 20, 45);
      doc.text(`Brand: ${record.brand || "N/A"}`, 20, 55);
      doc.text(`Size: ${record.size || "N/A"}`, 20, 65);
      doc.text(`Price: PHP${record.price || 0}`, 20, 75);
      doc.addImage(qrData, "PNG", 120, 20, 70, 70);
      doc.save(`${(record.item || "Item").replace(/\s+/g, "_")}_QR.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      message.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleDelete = (record) => {
    message.success(`${record.item} deleted successfully`);
  };

  const columns = [
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Price (₱)", dataIndex: "price", key: "price" },
    { title: "Stock In", dataIndex: "stock_in", key: "stock_in" },
    { title: "Stock Out", dataIndex: "stock_out", key: "stock_out" },
    {
      key: "actions",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          { key: "update", label: "Update", onClick: () => handleEdit(record) },
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
            <Button icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (fetchItemLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100%",
        }}
      >
        <Spin tip="Loading items..." />
      </div>
    );
  if (fetchItemFailed) return <Text type="danger">Failed to load items.</Text>;

  return (
    <ItemStyles>
      <Flex
        className="search-container"
        gap={20}
        align="center"
        style={{ marginBottom: 16, flexWrap: "wrap" }}
      >
        <Search
          placeholder="Search by name, brand, or category"
          className="search-input"
          style={{ width: 250 }}
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="primary" onClick={handleAdd}>
          Add Item
        </Button>
      </Flex>

      {!isMobile && (
        <Table
          dataSource={filteredItems}
          columns={columns}
          pagination={{ pageSize: 8 }}
        />
      )}

      {isMobile && (
        <div className="mobile-grid">
          {filteredItems.map((record) => (
            <div className="mobile-card" key={record.key}>
              <div className="mobile-header">
                <h4>{record.item}</h4>
                <Dropdown
                  menu={{
                    items: [
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
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button
                    icon={<EllipsisOutlined />}
                    type="text"
                    className="dropdown-btn"
                  />
                </Dropdown>
              </div>

              <p className="brand">{record.brand}</p>

              <div className="info-row">
                <strong>Category:</strong> <span>{record.category}</span>
              </div>
              <div className="info-row">
                <strong>Size:</strong> <span>{record.size}</span>
              </div>
              <div className="price">₱{record.price}</div>

              <div className="stock-info">
                <span className="in">In: {record.stock_in}</span>
                <span className="out">Out: {record.stock_out}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItemModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        selectedItem={selectedItem}
        refetch={refetch}
      />
    </ItemStyles>
  );
};

export default Item;
