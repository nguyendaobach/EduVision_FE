import React, { useState } from "react";
import { Table, Tag, Select } from "antd";

const { Option } = Select;

// Tạo 15 hóa đơn mẫu, chia đều trong 1 tháng gần nhất
const today = new Date();
const paymentData = Array.from({ length: 15 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - i * 2); // Cách nhau 2 ngày
  return {
    key: i + 1,
    paymentId: 47 + i,
    orderCode: (1752156489 + i).toString(),
    amount: 10000 + i * 1000,
    status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "success" : "failed",
    createdAt: d.toISOString(),
    userEmail: i % 2 === 0 ? "pdat1746@gmail.com" : "user" + (i + 1) + "@gmail.com",
  };
});

const columns = [
  {
    title: "ID giao dịch",
    dataIndex: "paymentId",
    key: "paymentId",
    align: "center",
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "orderCode",
    key: "orderCode",
    align: "center",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    align: "center",
    render: (amount) => amount.toLocaleString() + " đ",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: (status) => {
      let color = "default";
      let text = "";
      switch (status) {
        case "pending":
          color = "orange";
          text = "Chờ xử lý";
          break;
        case "success":
          color = "green";
          text = "Thành công";
          break;
        case "failed":
          color = "volcano";
          text = "Thất bại";
          break;
        default:
          text = status;
      }
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: (date) => {
      const d = new Date(date);
      return (
        <span>
          {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} <br />
          {d.toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
  {
    title: "Email người dùng",
    dataIndex: "userEmail",
    key: "userEmail",
    align: "center",
  },
];

const filterOptions = [
  { label: "Ngày hôm nay", value: "today" },
  { label: "7 ngày", value: "7days" },
  { label: "1 tháng", value: "1month" },
  { label: "2 tháng", value: "2months" },
];

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function isWithinDays(date, days) {
  const now = new Date();
  const d = new Date(date);
  const diff = (now - d) / (1000 * 60 * 60 * 24);
  return diff <= days && diff >= 0;
}

const filterData = (filter) => {
  if (!filter) return [];
  if (filter === "today") {
    return paymentData.filter((item) => isSameDay(new Date(item.createdAt), today));
  }
  if (filter === "7days") {
    return paymentData.filter((item) => isWithinDays(item.createdAt, 7));
  }
  if (filter === "1month") {
    return paymentData.filter((item) => isWithinDays(item.createdAt, 31));
  }
  if (filter === "2months") {
    return paymentData.filter((item) => isWithinDays(item.createdAt, 62));
  }
  return [];
};

const ManagePayment = () => {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const data = filterData(filter);

  // Scroll lên đầu trang khi chuyển trang Table
  const handleTableChange = (pagination) => {
    if (pagination.current !== page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPage(pagination.current);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-8">
      <h2 className="text-center mb-8 text-3xl font-bold">Quản lý giao dịch</h2>
      <div className="w-full max-w-6xl flex flex-col items-center sticky top-20 z-10">
        <div className="w-full max-w-5xl mb-4 flex flex-col md:flex-row gap-4 items-center justify-end">
          <Select
            placeholder="Chọn khoảng thời gian"
            value={filter || undefined}
            onChange={(val) => { setFilter(val); setPage(1); }}
            allowClear
            className="w-full md:w-1/3"
          >
            {filterOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
        </div>
        <div className="w-full max-w-6xl">
          <Table
            dataSource={data}
            columns={columns}
            bordered
            pagination={{ pageSize: 10, current: page, onChange: (p) => handleTableChange({ current: p }) }}
            className="rounded-xl shadow-lg"
            locale={{ emptyText: <div className="text-center text-gray-500 py-8">Chưa có item nào</div> }}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagePayment;
