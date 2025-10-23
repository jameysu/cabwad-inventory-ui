import React, { useState, useMemo } from "react";
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
} from "antd";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import MrisStyles from "./Mris.styles";

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
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadFilter, setDownloadFilter] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const screens = useBreakpoint();

  const data = [
    {
      key: 1,
      type: "stock-in",
      item: "Laptop",
      size: "15 inch",
      quantity: 10,
      amount: 65000,
      date: "2025-10-01T10:30:00",
    },
    {
      key: 2,
      type: "stock-out",
      item: "Mouse",
      size: "Medium",
      quantity: 5,
      amount: 1500,
      date: "2025-10-02T15:45:00",
    },
    {
      key: 3,
      type: "return",
      item: "Keyboard",
      size: "Full-size",
      quantity: 2,
      amount: 2000,
      date: "2025-10-03T09:20:00",
    },
    {
      key: 4,
      type: "stock-in",
      item: "Monitor",
      size: "24 inch",
      quantity: 8,
      amount: 32000,
      date: "2025-10-04T14:10:00",
    },
    {
      key: 5,
      type: "stock-out",
      item: "Laptop",
      size: "15 inch",
      quantity: 3,
      amount: 19500,
      date: "2025-10-05T11:55:00",
    },
    {
      key: 6,
      type: "return",
      item: "Mouse",
      size: "Small",
      quantity: 1,
      amount: 300,
      date: "2025-10-06T08:40:00",
    },
  ];

  // ✅ Updated columns to format date/time
  const columns = [
    { title: "Item Name", dataIndex: "item", key: "item" },
    { title: "Size", dataIndex: "size", key: "size" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (value) => `₱${value.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
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
      dataIndex: "type",
      key: "type",
      render: (text) => (
        <span
          style={{
            fontWeight: 600,
            color:
              text === "stock-in"
                ? "green"
                : text === "stock-out"
                ? "red"
                : "blue",
          }}
        >
          {text.toUpperCase()}
        </span>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((d) => d.type === filter);
  }, [filter, data]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDownload = async () => {
    try {
      if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
        message.error("Start date cannot be after End date.");
        return;
      }

      let exportData = [...data];

      if (downloadFilter.length > 0) {
        exportData = exportData.filter((d) => downloadFilter.includes(d.type));
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
        message.warning("No data found for the selected filters.");
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
          item: row.item,
          size: row.size,
          quantity: row.quantity,
          amount: row.amount,
          date: dayjs(row.date).format("MMMM D, YYYY hh:mm A"),
          type: row.type.toUpperCase(),
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
      message.success("Excel file downloaded successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Excel export error:", error);
      message.error("Failed to generate Excel file.");
    }
  };

  return (
    <MrisStyles>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={3}>Item Records</Title>
        </Col>

        <Col>
          <Space wrap>
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
          pagination={{ pageSize: 10 }}
          bordered
        />
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="mobile-cards">
            {filteredData.map((item) => {
              const date = dayjs(item.date);
              return (
                <div key={item.key} className="mobile-card">
                  <div className="card-header">
                    <span className="item-name">{item.item}</span>
                    <span className={`badge ${item.type}`}>{item.type}</span>
                  </div>
                  <div className="card-row">
                    <strong>Size:</strong> <span>{item.size}</span>
                  </div>
                  <div className="card-row">
                    <strong>Quantity:</strong> <span>{item.quantity}</span>
                  </div>
                  <div className="card-row">
                    <strong>Amount:</strong>{" "}
                    <span>₱{item.amount.toLocaleString()}</span>
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
    </MrisStyles>
  );
};

export default Mris;
