import React, { useMemo, useState, useEffect } from "react";
import ItemStyles from "./Item.styles";
import {
  Button,
  Dropdown,
  Flex,
  Input,
  Table,
  message,
  Typography,
  Spin,
  Modal,
  Form,
  Select,
  List,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ItemModal from "./ItemModal";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import {
  useDeleteItemMutation,
  useGetItemsQuery,
} from "../../services/itemApi";
import { DeleteOutlined } from "@ant-design/icons";
import { formatAmount } from "../../utils/formatAmount";
import { useAddStocksMutation } from "../../services/stockApi";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

const { Search } = Input;
const { Text, Title } = Typography;

const Item = () => {
  const {
    data: fetchItemSuccess,
    isLoading: fetchItemLoading,
    isError: fetchItemFailed,
    refetch,
  } = useGetItemsQuery();
  console.log("fetchItemSuccess", fetchItemSuccess);

  const [
    deleteItem,
    {
      data: deleteItemSuccess,
      isLoading: deleteItemLoading,
      isError: deleteItemFailed,
    },
  ] = useDeleteItemMutation();

  const [messageApi, contextHolder] = message.useMessage();
  const [addStocks, { isLoading: isSubmitting }] = useAddStocksMutation();

  const [generateQRForm] = Form.useForm();

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchTerm, setSearchTerm] = useState("");
  const [openQRModal, setOpenQRModal] = useState(false);
  const [qrItems, setQrItems] = useState([]);
  const [generatedQR, setGeneratedQR] = useState(null);

  const [qrStocks, setQrStocks] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);

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
        .includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, items]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (deleteItemSuccess && !deleteItemLoading) {
      refetch();
      messageApi.success("Item deleted successfully");
    }
    if (deleteItemFailed && !deleteItemLoading) {
      messageApi.error("Failed to delete item");
    }
  }, [
    deleteItemFailed,
    deleteItemLoading,
    deleteItemSuccess,
    messageApi,
    refetch,
  ]);

  useEffect(() => {
    if (!isQRModalOpen) return;

    let scanner;

    const timeout = setTimeout(async () => {
      const qrElement = document.getElementById("qr-reader");
      if (!qrElement) {
        messageApi.error("QR reader element not found");
        return;
      }

      scanner = new Html5Qrcode("qr-reader");
      setQrScanner(scanner);

      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            handleQrResult(decodedText);
            safeStopScanner(scanner);
            setIsQRModalOpen(false);
          },
        );
      } catch {
        messageApi.error("Camera access denied or unavailable");
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      safeStopScanner(scanner);
    };
  }, [isQRModalOpen, messageApi]);

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
      messageApi.error("Failed to generate PDF. Please try again.");
    }
  };

  const handleDelete = (id) => {
    deleteItem(id);
  };

  const handleGenerateQR = () => {
    setOpenQRModal(true);
  };

  const handleQrResult = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      console.log("decodedText", decodedText);

      if (!Array.isArray(parsed.stocks)) {
        throw new Error("Invalid QR format");
      }

      setQrStocks(parsed.stocks);
      setIsPreviewModalOpen(true);
      message.success("QR data loaded successfully");
    } catch (err) {
      message.error("Invalid QR code data");
      console.log(err);
    }
  };

  const handleSubmitGenerateQR = async () => {
    const { control_no } = generateQRForm.getFieldsValue();

    if (!control_no) {
      messageApi.warning("Control Number is required");
      return;
    }

    const stocks = qrItems.map(({ id, ...rest }) => ({
      ...rest,
      item_id: id,
      control_no,
    }));

    const payload = { stocks };

    try {
      const qrString = JSON.stringify(payload);
      const qrImage = await QRCode.toDataURL(qrString);

      setGeneratedQR(qrImage);
      setQrItems([]);
      generateQRForm.resetFields();
      setOpenQRModal(false);
    } catch (err) {
      messageApi.error("Failed to generate QR");
    }
  };

  const handleAddQRItem = () => {
    const values = generateQRForm.getFieldsValue();

    if (!values.item || !values.quantity || !values.transaction_type) {
      messageApi.warning("Please complete all fields before adding");
      return;
    }

    const selectedItem = items.find((i) => i.key === values.item);

    if (!selectedItem) {
      messageApi.error("Selected item not found");
      return;
    }

    setQrItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === values.item);

      // ✅ If item already exists → add quantity
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            Number(updated[existingIndex].quantity) + Number(values.quantity),
        };
        return updated;
      }

      // ✅ Otherwise → add new item
      return [
        ...prev,
        {
          id: values.item,
          name: `${selectedItem.brand} ${selectedItem.item}`,
          price: Number(selectedItem.price),
          quantity: Number(values.quantity),
          transaction_type: values.transaction_type,
        },
      ];
    });

    generateQRForm.resetFields(["item", "quantity"]);
  };

  const handleRemoveQRItem = (index) => {
    setQrItems((prev) => prev.filter((_, i) => i !== index));
  };

  const safeStopScanner = async (scanner) => {
    if (!scanner) return;

    try {
      const state = scanner.getState();
      if (
        state === Html5QrcodeScannerState.SCANNING ||
        state === Html5QrcodeScannerState.PAUSED
      ) {
        await scanner.stop();
      }
    } catch {
      // swallow safely
    }
  };

  const handleSubmitQrStocks = async () => {
    if (qrStocks.length === 0) {
      message.warning("No items to submit");
      return;
    }

    try {
      await addStocks({ stocks: qrStocks }).unwrap();
      message.success("Stocks successfully submitted");

      setQrStocks([]);
      setIsPreviewModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit stocks");
    }
  };

  const columns = [
    { title: "Item", dataIndex: "item", key: "item" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Size", dataIndex: "size", key: "size" },
    {
      title: "Price (₱)",
      dataIndex: "price",
      key: "price",
      render: (value) => `₱${formatAmount(value)}`,
    },
    { title: "Stock In", dataIndex: "stock_in", key: "stock_in" },
    { title: "Stock Out", dataIndex: "stock_out", key: "stock_out" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      key: "actions",
      align: "center",
      render: (_, record) => {
        const menuItems = [
          { key: "update", label: "Update", onClick: () => handleEdit(record) },
          // {
          //   key: "export",
          //   label: "Export QR",
          //   onClick: () => handleExportSinglePDF(record),
          // },
          {
            key: "delete",
            label: "Delete",
            onClick: () => handleDelete(record.id),
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

  const qrColumns = [
    {
      title: "Item Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (v) => `₱${v.toLocaleString()}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      render: (type) => ({ 1: "STOCK-IN", 2: "STOCK-OUT", 3: "RETURN" })[type],
    },
    {
      title: "Action",
      render: (_, __, index) => (
        <Button
          danger
          size="small"
          onClick={() =>
            setQrStocks((prev) => prev.filter((_, i) => i !== index))
          }
        >
          Remove
        </Button>
      ),
    },
  ];

  if (fetchItemLoading)
    return (
      <Spin tip="Loading items...">
        <div style={{ height: "80vh" }} />
      </Spin>
    );
  if (fetchItemFailed) return <Text type="danger">Failed to load items.</Text>;

  return (
    <ItemStyles>
      {contextHolder}
      <Flex
        className="search-container"
        gap={10}
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
        <Button type="primary" onClick={handleGenerateQR}>
          Generate Request
        </Button>
        <Button type="primary" onClick={() => setIsQRModalOpen(true)}>
          Create Request
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
                        onClick: () => handleDelete(record.key),
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
              <div className="price">₱{formatAmount(record.price)}</div>
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
      {generatedQR && (
        <Modal
          open={true}
          footer={null}
          onCancel={() => setGeneratedQR(null)}
          centered
          title="Generated QR Code"
        >
          <Flex vertical align="center" gap={16}>
            <img
              src={generatedQR}
              alt="Generated QR"
              style={{ width: 250, height: 250 }}
            />

            <Button
              type="primary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = generatedQR;
                link.download = "request-qr.png";
                link.click();
              }}
            >
              Download QR
            </Button>
          </Flex>
        </Modal>
      )}
      <Modal
        open={openQRModal}
        onCancel={() => setOpenQRModal(false)}
        title="Generate Request"
        centered
        footer={[
          <Button key="cancel" onClick={() => setOpenQRModal(false)}>
            Cancel
          </Button>,
          <Button
            key="generate"
            type="primary"
            onClick={() => handleSubmitGenerateQR()}
            disabled={!qrItems.length}
          >
            Generate
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          form={generateQRForm}
          onFinish={handleSubmitGenerateQR}
        >
          <Form.Item name="item" label="Item">
            <Select
              showSearch
              placeholder={"Choose item to add"}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children
                  ?.toString()
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {filteredItems.map((item) => {
                return (
                  <Option value={item.key} key={item.key}>
                    {`${item.brand} ${item.item}`}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                validator: (_, value) =>
                  value && Number(value) > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Quantity must be greater than 0"),
                      ),
              },
            ]}
          >
            <Input type="number" placeholder="Enter quantity" />
          </Form.Item>
          <Form.Item name="transaction_type" label="Request Type">
            <Select placeholder={"Choose request"}>
              <Option value={1}>Stock In</Option>
              <Option value={2}>Stock Out</Option>
              <Option value={3}>Return</Option>
            </Select>
          </Form.Item>
          <Button type="dashed" block onClick={handleAddQRItem}>
            Add Item
          </Button>

          {!!qrItems.length && (
            <List
              style={{ marginTop: 16 }}
              bordered
              dataSource={qrItems}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveQRItem(index)}
                    />,
                  ]}
                >
                  <Text ellipsis style={{ width: "70%" }}>
                    {item.quantity} pcs - {item.name}
                  </Text>
                </List.Item>
              )}
            />
          )}
          <Form.Item name="control_no" label="Control Number">
            <Input name="control_no" placeholder="Enter Control Number" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Scan QR Code"
        open={isQRModalOpen}
        onCancel={async () => {
          await safeStopScanner(qrScanner);
          setIsQRModalOpen(false);
        }}
        footer={null}
        centered
        destroyOnClose
        afterClose={() => {
          setQrScanner(null); // cleanup
        }}
      >
        <div
          id="qr-reader"
          style={{
            width: "100%",
            minHeight: 300,
          }}
        />

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file || !qrScanner) return;

              try {
                await safeStopScanner(qrScanner);

                const decodedText = await qrScanner.scanFile(file, true);
                handleQrResult(decodedText);
                setIsQRModalOpen(false);
              } catch (err) {
                console.error(err);
                messageApi.error("Failed to scan QR from image.");
              }
            }}
          />

          <div style={{ fontSize: 12, opacity: 0.7 }}>Or upload QR image</div>
        </div>
      </Modal>
      <Modal
        title="Scanned Stock Preview"
        open={isPreviewModalOpen}
        onCancel={() => setIsPreviewModalOpen(false)}
        onOk={handleSubmitQrStocks}
        okText="Submit"
        confirmLoading={isSubmitting}
        width={700}
        centered
      >
        <div style={{ overflowX: "auto" }}>
          <Table
            columns={qrColumns}
            dataSource={qrStocks}
            rowKey={(row, index) => `${row.item_id}-${index}`}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </div>
      </Modal>
    </ItemStyles>
  );
};

export default Item;
