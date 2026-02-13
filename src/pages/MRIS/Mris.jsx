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

  console.log("fetchStocksSuccess", fetchStocksSuccess);

  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadFilter, setDownloadFilter] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const screens = useBreakpoint();

  const [controlNoInput, setControlNoInput] = useState("");

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isStocksModalOpen, setIsStocksModalOpen] = useState(false);

  const openStocksModal = (group) => {
    setSelectedGroup(group);
    setIsStocksModalOpen(true);
  };

  const closeStocksModal = () => {
    setSelectedGroup(null);
    setIsStocksModalOpen(false);
  };

  const columns = [
    {
      title: "Control Number",
      dataIndex: "control_no",
      render: (_, record) => (
        <Button type="link" onClick={() => openStocksModal(record)}>
          {record.control_no}
        </Button>
      ),
    },
    {
      title: "Date / Time",
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
      title: "Return",
      render: (_, record) => {
        const isStockOut = record.transaction_type === 2;

        if (!isStockOut) {
          return <span style={{ opacity: 0.5 }}>—</span>;
        }

        return (
          <Space>
            <InputNumber
              min={0}
              max={record.quantity}
              value={record.returnQty || 0}
              onChange={(value) => record.onReturnChange?.(record, value)}
              style={{ width: 90 }}
            />
            <Button
              size="small"
              type="primary"
              onClick={() => handleUpdateStock(record)}
            >
              Update
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

      let data =
        (fetchStocksSuccess &&
          fetchStocksSuccess.stocks &&
          fetchStocksSuccess.stocks
            .filter((s) => {
              // With control number → exact match
              if (controlNo) {
                return s.control_no === controlNo;
              }

              // Without control number → include null or empty
              return s.control_no === null || s.control_no === "";
            })
            .map((s) => ({
              ...s,
              type: transactionTypeMap[s.transaction_type],
            }))) ||
        [];

      if (!data.length) {
        messageApi.error(
          controlNo
            ? `No stocks found under control number "${controlNo}"`
            : "No stocks found without a control number",
        );
        return;
      }

      if (downloadFilter && downloadFilter.length) {
        data = data.filter((d) => downloadFilter.includes(d.type));
      }

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

      // 🔹 DATE/TIME FALLBACK
      const now = dayjs();
      const dateTimeStamp = now.format("YYYYMMDD_HHmmss");

      const sheetName = controlNo || `${dateTimeStamp}`;
      const headerText = controlNo
        ? `CONTROL NUMBER: ${controlNo}`
        : `CONTROL NUMBER: N/A (${now.format("MMMM D, YYYY hh:mm A")})`;

      // 🔹 EXCEL GENERATION
      const workbook = new ExcelJS.Workbook();
      const ws = workbook.addWorksheet(sheetName);

      ws.mergeCells("A1:F1");
      ws.getCell("A1").value = headerText;
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
            {/* Download Action */}
            <Button type="primary" onClick={handleOpenModal}>
              Download Record
            </Button>
          </Space>
        </Col>
      </Row>

      {screens.md ? (
        <Table
          columns={columns}
          dataSource={fetchStocksByControlNo.data}
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
          columns={stockColumns}
          dataSource={selectedGroup?.stocks || []}
          rowKey={(r, i) => `${r.item_id}-${i}`}
          pagination={false}
        />
      </Modal>
    </MrisStyles>
  );
};

export default Mris;
