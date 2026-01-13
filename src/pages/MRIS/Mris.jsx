import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Grid,
  Modal,
  DatePicker,
  message,
  Row,
  Col,
  Checkbox,
  Spin,
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
            // messageApi.success(`QR Scanned: ${decodedText}`);
            handleQrResult(decodedText);
            safeStopScanner(scanner);
            setIsQRModalOpen(false);
          }
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
    { title: "Item Name", dataIndex: "description", key: "description" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Amount",
      dataIndex: "total_price",
      key: "total_price",
      render: (value) => `₱${value?.toLocaleString()}`,
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
      title: "Type",
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
      render: (type) => ({ 1: "STOCK-IN", 2: "STOCK-OUT", 3: "RETURN" }[type]),
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
          Delete
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
      (d) => d.transaction_type === filterMap[filter]
    );
  }, [fetchStocksSuccess?.stocks, filter]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDownload = async () => {
    try {
      if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
        messageApi.error("Start date cannot be after End date.");
        return;
      }

      const transactionTypeMap = {
        1: "stock-in",
        2: "stock-out",
        3: "return",
      };

      let exportData = fetchStocksSuccess?.stocks.map((item) => ({
        ...item,
        transaction_type:
          transactionTypeMap[item.transaction_type] || "Unknown",
      }));

      if (downloadFilter.length > 0) {
        exportData = exportData.filter((d) =>
          downloadFilter.includes(d.transaction_type)
        );
      }

      if (startDate) {
        exportData = exportData.filter((d) =>
          dayjs(d.date).isSameOrAfter(dayjs(startDate), "day")
        );
      }
      if (endDate) {
        exportData = exportData.filter((d) =>
          dayjs(d.date).isSameOrBefore(dayjs(endDate), "day")
        );
      }

      if (exportData.length === 0) {
        messageApi.warning("No data found for the selected filters.");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("MRIS Records");

      worksheet.columns = [
        { header: "Item Name", key: "item", width: 25 },
        { header: "Size", key: "size", width: 20 },
        { header: "Quantity", key: "quantity", width: 12 },
        { header: "Amount (₱)", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 20 },
        { header: "Type", key: "type", width: 15 },
      ];

      exportData.forEach((row) => {
        worksheet.addRow({
          item: row.description,
          size: row.size,
          quantity: row.quantity,
          amount: row.total_price,
          date: dayjs(row.createdAt).format("MMMM D, YYYY hh:mm A"),
          type: row.transaction_type.toUpperCase(),
        });
      });

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1677FF" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });

      const buffer = await workbook.xlsx.writeBuffer();

      const parts = ["MRIS"];
      if (downloadFilter.length > 0)
        parts.push(downloadFilter.join("_").replace(/-/g, ""));
      if (startDate) parts.push(dayjs(startDate).format("YYYYMMDD"));
      if (endDate) parts.push(dayjs(endDate).format("YYYYMMDD"));
      const filename = `${parts.join("_")}.xlsx`;

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, filename);
      messageApi.success("Excel file downloaded successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Excel export error:", error);
      messageApi.error("Failed to generate Excel file.");
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
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>Item Records</Title>
        </Col>

        <Col>
          <Space wrap>
            <Button type="primary" onClick={() => setIsQRModalOpen(true)}>
              Create Request
            </Button>

            <Button type="primary" onClick={handleOpenModal}>
              Download Record
            </Button>

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
                    <strong>Amount:</strong>{" "}
                    <span>₱{item.total_price?.toLocaleString()}</span>
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
        onCancel={handleCloseModal}
        onOk={handleDownload}
        okText="Download"
        centered
        destroyOnClose
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <label>
            <strong>Start Date</strong>
          </label>
          <DatePicker
            value={startDate}
            onChange={(d) => setStartDate(d)}
            style={{ width: "100%" }}
            allowClear
          />

          <label>
            <strong>End Date</strong>
          </label>
          <DatePicker
            value={endDate}
            onChange={(d) => setEndDate(d)}
            style={{ width: "100%" }}
            allowClear
          />

          <label>
            <strong>Filter Type</strong>
          </label>
          <Checkbox.Group
            options={STATUS_OPTIONS}
            value={downloadFilter}
            onChange={setDownloadFilter}
            style={{ display: "flex", gap: 8 }}
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
            scroll={{ x: "max-content" }} // allow horizontal scroll if needed
          />
        </div>
      </Modal>
    </MrisStyles>
  );
};

export default Mris;
