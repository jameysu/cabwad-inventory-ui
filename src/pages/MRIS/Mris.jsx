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
  InputNumber,
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
  useGetStocksSortedByControlNumberQuery,
  useReturnStockMutation,
} from "../../services/stockApi";
import { formatAmount } from "../../utils/formatAmount";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const STATUS_OPTIONS = [
  { label: "Stock-In", value: "stock-in" },
  { label: "Stock-Out", value: "stock-out" },
];

const Mris = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const {
    data: fetchStocksSuccess,
    isLoading: fetchStocksLoading,
    isError: fetchStocksFailed,
  } = useGetStocksQuery();
  const { data: fetchStocksByControlNo } =
    useGetStocksSortedByControlNumberQuery();

  const [returnStock, { isLoading: returnLoading }] = useReturnStockMutation();

  console.log("fetchStocksSuccess", fetchStocksSuccess);

  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadFilter, setDownloadFilter] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returnValues, setReturnValues] = useState({});

  const screens = useBreakpoint();

  const [controlNoInput, setControlNoInput] = useState("");

  const [selectedControlNo, setSelectedControlNo] = useState(null);

  const [isStocksModalOpen, setIsStocksModalOpen] = useState(false);
  const [controlNoSearch, setControlNoSearch] = useState("");

  const openStocksModal = (group) => {
    setReturnValues({});
    setSelectedControlNo(group.control_no);
    setIsStocksModalOpen(true);
  };

  const closeStocksModal = () => {
    setSelectedControlNo(null);
    setIsStocksModalOpen(false);
  };

  const selectedGroup = useMemo(() => {
    if (!selectedControlNo) return null;

    return fetchStocksByControlNo?.data?.find(
      (g) => g.control_no === selectedControlNo,
    );
  }, [fetchStocksByControlNo?.data, selectedControlNo]);

  const handleReturnChange = (record, value) => {
    setReturnValues((prev) => ({
      ...prev,
      [record.id]: value, // ✅ FIXED (was item_id)
    }));
  };

  const handleReturnStock = async (record) => {
    const qty = returnValues[record.id]; // ✅ FIXED

    if (!qty || qty <= 0) {
      messageApi.warning("Please enter a valid return quantity");
      return;
    }

    try {
      await returnStock({
        stock_id: record.id,
        quantity: qty,
        createdby: 1, // replace with logged user id
      }).unwrap();

      messageApi.success("Stock returned successfully");

      // clear only that row input
      setReturnValues((prev) => ({
        ...prev,
        [record.id]: null,
      }));
    } catch (err) {
      messageApi.error(err?.data?.message || "Return failed");
    }
  };

  const filteredControlGroups = useMemo(() => {
    if (!controlNoSearch) return fetchStocksByControlNo?.data || [];

    const keyword = controlNoSearch.trim().toLowerCase();

    return (fetchStocksByControlNo?.data || []).filter((item) => {
      const controlNo = item.control_no?.toLowerCase() || "";

      // support BOTH formats
      const createdBy =
        item.createdby?.toLowerCase() ||
        item.creator?.username?.toLowerCase() ||
        "";

      return controlNo.includes(keyword) || createdBy.includes(keyword);
    });
  }, [fetchStocksByControlNo?.data, controlNoSearch]);

  const columns = [
    {
      title: "Control Number",
      dataIndex: "control_no",
      render: (_, record) => (
        <Button type="link" onClick={() => openStocksModal(record)}>
          {record.control_no}
        </Button>
      ),
      width: 300,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (v) => dayjs(v).format("MM/DD/YYYY"),
    },
    {
      title: "Name",
      dataIndex: "createdby",
    },
  ];

  const stockColumns = [
    {
      title: "Item Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      key: "total_price",
      render: (_, record) => {
        const total = (record.price || 0) * (record.quantity || 0);
        return `₱${formatAmount(total)}`;
      },
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      render: (t) => ({ 1: "STOCK-IN", 2: "STOCK-OUT", 3: "RETURN" })[t],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Return Quantity",
      dataIndex: "return_quantity",
    },
    {
      title: "Return",
      render: (_, record) => {
        const isStockOut = record.transaction_type === 2;
        const isFullyReturned =
          (record.return_quantity || 0) >= record.quantity;

        // Not stock-out → no return
        if (!isStockOut) {
          return <span style={{ opacity: 0.5 }}>—</span>;
        }

        // Fully returned → hide button/input
        if (isFullyReturned) {
          return (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Fully Returned
            </Text>
          );
        }

        // Can still return
        return (
          <Space>
            <InputNumber
              min={1}
              max={record.quantity - (record.return_quantity || 0)}
              value={returnValues[record.id] || null}
              onChange={(value) => handleReturnChange(record, value)}
              style={{ width: 90 }}
            />
            <Button
              size="small"
              type="primary"
              onClick={() => handleReturnStock(record)}
            >
              Return
            </Button>
          </Space>
        );
      },
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

  const handleDownload = async () => {
    try {
      const controlNo =
        controlNoInput && controlNoInput.trim() ? controlNoInput.trim() : null;

      const transactionTypeMap = {
        1: "stock-in",
        2: "stock-out",
        3: "return",
      };

      // Start with ALL stocks
      let data = (fetchStocksSuccess?.stocks || []).map((s) => ({
        ...s,
        type: transactionTypeMap[s.transaction_type],
      }));

      // Filter by Control Number (if provided)
      if (controlNo) {
        data = data.filter((s) => s.control_no === controlNo);

        if (!data.length) {
          messageApi.error(
            `No stocks found under control number "${controlNo}"`,
          );
          return;
        }
      }

      // Filter by Transaction Type
      if (downloadFilter?.length) {
        data = data.filter((d) => downloadFilter.includes(d.type));
      }

      // Filter by Start Date
      if (startDate) {
        data = data.filter((d) =>
          dayjs(d.createdAt).isSameOrAfter(startDate, "day"),
        );
      }

      // Filter by End Date
      if (endDate) {
        data = data.filter((d) =>
          dayjs(d.createdAt).isSameOrBefore(endDate, "day"),
        );
      }

      if (!data.length) {
        messageApi.error("No data matched the selected filters");
        return;
      }

      const now = dayjs();
      const dateTimeStamp = now.format("YYYYMMDD_HHmmss");

      const sheetName = controlNo || `ALL_${dateTimeStamp}`;
      const headerText = controlNo
        ? `CONTROL NUMBER: ${controlNo}`
        : `ALL RECORDS (${now.format("MMMM D, YYYY hh:mm A")})`;

      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet("MRIS Report");

      // ===== TITLE ROW =====
      ws.mergeCells("A1:G1");
      ws.getCell("A1").value = headerText;
      ws.getCell("A1").font = { bold: true, size: 14 };
      ws.getCell("A1").alignment = { horizontal: "center" };

      // Blank row
      ws.addRow([]);

      // ===== HEADER ROW (Row 3) =====
      const headerRow = ws.addRow([
        "Control No",
        "Item Name",
        "Size",
        "Quantity",
        "Total Amount (₱)",
        "Date",
        "Transaction Type",
      ]);

      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1677FF" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Set column widths
      ws.columns = [
        { width: 18 },
        { width: 28 },
        { width: 15 },
        { width: 12 },
        { width: 18 },
        { width: 24 },
        { width: 18 },
      ];

      // ===== DATA ROWS =====
      let totalSum = 0;

      data.forEach((r) => {
        const row = ws.addRow([
          r.control_no || "N/A",
          r.description,
          r.size,
          r.quantity,
          r.total_price,
          dayjs(r.createdAt).format("MMMM D, YYYY hh:mm A"),
          r.type.toUpperCase(),
        ]);

        totalSum += Number(r.total_price || 0);

        row.getCell(5).numFmt = '"₱"#,##0.00';

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // ===== TOTAL ROW =====
      ws.addRow([]);

      const totalRow = ws.addRow(["", "", "", "TOTAL:", totalSum, "", ""]);

      totalRow.getCell(4).font = { bold: true };
      totalRow.getCell(5).font = { bold: true };
      totalRow.getCell(5).numFmt = '"₱"#,##0.00';

      // Enable auto filter
      ws.autoFilter = {
        from: "A3",
        to: `G${ws.rowCount}`,
      };

      const buffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `MRIS_${sheetName}.xlsx`,
      );

      messageApi.success("Excel exported successfully");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      messageApi.error("Excel export failed");
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
            <Input
              placeholder="Search Control Number or Creator"
              value={controlNoSearch}
              onChange={(e) => setControlNoSearch(e.target.value)}
              allowClear
              style={{ width: 300 }}
            />

            <Button type="primary" onClick={handleOpenModal}>
              Download Record
            </Button>
          </Space>
        </Col>
      </Row>

      {screens.md ? (
        <Table
          columns={columns}
          dataSource={filteredControlGroups}
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
        open={isStocksModalOpen}
        onCancel={closeStocksModal}
        title={`Control No: ${selectedGroup?.control_no}`}
        width={800}
        footer={null}
        centered
      >
        <Table
          key={selectedGroup?.control_no}
          columns={stockColumns}
          dataSource={selectedGroup?.stocks || []}
          rowKey={(r) => r.id}
          pagination={false}
        />
      </Modal>
    </MrisStyles>
  );
};

export default Mris;
