import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Grid,
  Modal,
  DatePicker,
  message,
  Row,
  Col,
  Checkbox,
  Spin,
  Input,
} from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import MrisStyles from "./Mris.styles";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import {
  useAddStocksMutation,
  useGetStocksQuery,
} from "../../services/stockApi";
import { formatAmount } from "../../utils/formatAmount";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STATUS_OPTIONS = [
  { label: "Stock-In", value: "stock-in" },
  { label: "Stock-Out", value: "stock-out" },
  { label: "Return", value: "return" },
];

const Mris = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    data: fetchStocksSuccess,
    isLoading: fetchStocksLoading,
    isError: fetchStocksFailed,
    refetch,
  } = useGetStocksQuery();
  const [addStocks, { isLoading: isSubmitting }] = useAddStocksMutation();

  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadFilter, setDownloadFilter] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const screens = useBreakpoint();

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrScanner, setQrScanner] = useState(null);

  const [qrStocks, setQrStocks] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const [controlNoInput, setControlNoInput] = useState("");

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

  const columns = [
    { title: "Control Number", dataIndex: "control_no", key: "control_no" },
    { title: "Item Name", dataIndex: "description", key: "description" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Total Amount",
      dataIndex: "total_price",
      key: "total_price",
      render: (value) => `₱${formatAmount(value)}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => {
        const date = dayjs(value);
        return (
          <>
            <div>{date.format("MMMM D, YYYY")}</div>
            <div style={{ fontSize: "12px", opacity: 0.6 }}>
              {date.format("hh:mm A")}
            </div>
          </>
        );
      },
    },
    {
      title: "Request Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      render: (type) => {
        const typeMap = {
          1: { label: "STOCK-IN", color: "green" },
          2: { label: "STOCK-OUT", color: "red" },
          3: { label: "RETURN", color: "blue" },
        };

        const { label, color } = typeMap[type] || {
          label: "UNKNOWN",
          color: "gray",
        };

        return <span style={{ fontWeight: 600, color }}>{label}</span>;
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

  const filteredData = useMemo(() => {
    if (filter === "all") return fetchStocksSuccess?.stocks;

    const filterMap = {
      "stock-in": 1,
      "stock-out": 2,
      return: 3,
    };

    return fetchStocksSuccess?.stocks.filter(
      (d) => d.transaction_type === filterMap[filter],
    );
  }, [fetchStocksSuccess?.stocks, filter]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDownload = async () => {
    try {
      if (!controlNoInput.trim()) {
        messageApi.error("Please enter a control number");
        return;
      }

      const transactionTypeMap = {
        1: "stock-in",
        2: "stock-out",
        3: "return",
      };

      let data =
        fetchStocksSuccess?.stocks
          ?.filter((s) => s.control_no === controlNoInput.trim())
          ?.map((s) => ({
            ...s,
            type: transactionTypeMap[s.transaction_type],
          })) || [];

      if (!data.length) {
        messageApi.error(
          `No stocks found under control number "${controlNoInput}"`,
        );
        return;
      }

      // 🔹 FILTER BY TRANSACTION TYPE
      if (downloadFilter.length) {
        data = data.filter((d) => downloadFilter.includes(d.type));
      }

      // 🔹 FILTER BY DATE
      if (startDate) {
        data = data.filter((d) =>
          dayjs(d.createdAt).isSameOrAfter(startDate, "day"),
        );
      }

      if (endDate) {
        data = data.filter((d) =>
          dayjs(d.createdAt).isSameOrBefore(endDate, "day"),
        );
      }

      if (!data.length) {
        messageApi.error("No data matched the selected filters");
        return;
      }

      // 🔹 SINGLE CONTROL NUMBER → ONE SHEET
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet(controlNoInput);

      ws.mergeCells("A1:F1");
      ws.getCell("A1").value = `CONTROL NUMBER: ${controlNoInput}`;
      ws.getCell("A1").font = { bold: true, size: 14 };
      ws.getCell("A1").alignment = { horizontal: "center" };

      ws.addRow([]);

      ws.columns = [
        { header: "Item Name", key: "item", width: 30 },
        { header: "Size", key: "size", width: 15 },
        { header: "Quantity", key: "quantity", width: 12 },
        { header: "Total Amount (₱)", key: "amount", width: 18 },
        { header: "Date", key: "date", width: 25 },
        { header: "Type", key: "type", width: 15 },
      ];

      ws.getRow(3).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1677FF" },
        };
        cell.alignment = { horizontal: "center" };
      });

      data.forEach((r) => {
        ws.addRow({
          item: r.description,
          size: r.size,
          quantity: r.quantity,
          amount: r.total_price,
          date: dayjs(r.createdAt).format("MMMM D, YYYY hh:mm A"),
          type: r.type.toUpperCase(),
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `MRIS_${controlNoInput}.xlsx`,
      );

      messageApi.success("Excel exported successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      messageApi.error("Excel export failed");
    }
  };

  const handleQrResult = (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);

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

  if (fetchStocksLoading)
    return (
      <Spin tip="Loading...">
        <div style={{ height: "80vh" }} />
      </Spin>
    );
  if (fetchStocksFailed)
    return <Text type="danger">Failed to load stocks.</Text>;

  return (
    <MrisStyles>
      {contextHolder}
      <Row
        gutter={[12, 12]}
        justify="space-between"
        align="middle"
        style={{ marginBottom: 16 }}
      >
        {/* Title */}
        <Col xs={24} md="auto">
          <Title level={3} style={{ margin: 0 }}>
            Item Records
          </Title>
        </Col>

        {/* Actions */}
        <Col xs={24} md="auto">
          <Space wrap size="middle">
            {/* Download Action */}
            <Button type="primary" onClick={handleOpenModal}>
              Download Record
            </Button>

            {/* Filter Group */}
            <Space.Compact>
              <Button
                type={filter === "all" ? "primary" : "default"}
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                type={filter === "stock-in" ? "primary" : "default"}
                onClick={() => setFilter("stock-in")}
              >
                Stock-In
              </Button>
              <Button
                type={filter === "stock-out" ? "primary" : "default"}
                onClick={() => setFilter("stock-out")}
              >
                Stock-Out
              </Button>
              <Button
                type={filter === "return" ? "primary" : "default"}
                onClick={() => setFilter("return")}
              >
                Return
              </Button>
            </Space.Compact>
          </Space>
        </Col>
      </Row>

      {screens.md ? (
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id}
          pagination={{ pageSize: 10 }}
          bordered
        />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="mobile-cards">
            {filteredData?.map((item) => {
              const date = dayjs(item.createdAt);
              return (
                <div key={item.id} className="mobile-card">
                  <div className="card-row">
                    <span>{item.control_no}</span>
                  </div>
                  <div className="card-header">
                    <span className="item-name">{item.description}</span>
                    <span
                      className={`badge ${
                        item.transaction_type === 1
                          ? "stock-in"
                          : item.transaction_type === 2
                            ? "stock-out"
                            : "return"
                      }`}
                    >
                      {item.transaction_type === 1
                        ? "STOCK-IN"
                        : item.transaction_type === 2
                          ? "STOCK-OUT"
                          : "RETURN"}
                    </span>
                  </div>

                  <div className="card-row">
                    <strong>Size:</strong> <span>{item.size}</span>
                  </div>
                  <div className="card-row">
                    <strong>Quantity:</strong> <span>{item.quantity}</span>
                  </div>
                  <div className="card-row">
                    <strong>Total Amount:</strong>{" "}
                    <span>₱{formatAmount(item.total_price)}</span>
                  </div>
                  <div className="card-row">
                    <strong>Date:</strong>{" "}
                    <span>
                      {date.format("MMMM D, YYYY")}
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.6,
                          marginTop: "2px",
                        }}
                      >
                        {date.format("hh:mm A")}
                      </div>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Space>
      )}

      <Modal
        title="Download Records"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleDownload}
        okText="Download"
        centered
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Input
            placeholder="Enter Control Number"
            value={controlNoInput}
            onChange={(e) => setControlNoInput(e.target.value)}
            allowClear
          />

          <DatePicker
            placeholder="Start Date"
            value={startDate}
            onChange={setStartDate}
            style={{ width: "100%" }}
          />

          <DatePicker
            placeholder="End Date"
            value={endDate}
            onChange={setEndDate}
            style={{ width: "100%" }}
            disabledDate={(d) => startDate && d.isBefore(startDate, "day")}
          />

          <Text strong>Transaction Type</Text>
          <Checkbox.Group
            options={STATUS_OPTIONS}
            value={downloadFilter}
            onChange={setDownloadFilter}
          />
        </Space>
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
                // messageApi.success(`QR Scanned: ${decodedText}`);
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
    </MrisStyles>
  );
};

export default Mris;
