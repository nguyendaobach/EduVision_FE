import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { adminAPI } from "../../services/apiService";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  CrownOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const getUniqueRoles = (data) => {
  const roles = data.map((u) => u.role);
  return Array.from(new Set(roles));
};

const columns = (onUpdate, onReactivate) => [
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        <span className="text-xs bg-blue-100 px-2 py-1 rounded-full mr-2">
          ID
        </span>
        Mã người dùng
      </div>
    ),
    dataIndex: "userId",
    key: "userId",
    align: "center",
    width: 120,
    render: (text) => (
      <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded-lg">
        #{text}
      </div>
    ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        <UserOutlined className="mr-2" />
        Họ và tên
      </div>
    ),
    dataIndex: "fullName",
    key: "fullName",
    align: "center",
    width: 200,
    render: (text) => (
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
          {text ? text.charAt(0).toUpperCase() : "?"}
        </div>
        <span className="font-medium text-gray-900">
          {text || <i className="text-gray-400">(Chưa cập nhật)</i>}
        </span>
      </div>
    ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        📧 Email
      </div>
    ),
    dataIndex: "email",
    key: "email",
    align: "center",
    width: 250,
    render: (text) => (
      <div className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
        {text}
      </div>
    ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        ✅ Xác thực
      </div>
    ),
    dataIndex: "isVerified",
    key: "isVerified",
    align: "center",
    width: 130,
    render: (verified) =>
      verified ? (
        <Tag
          color="success"
          icon={<CheckCircleOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "white",
          }}
        >
          Đã xác thực
        </Tag>
      ) : (
        <Tag
          color="warning"
          icon={<CloseCircleOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "white",
          }}
        >
          Chưa xác thực
        </Tag>
      ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        🔄 Trạng thái
      </div>
    ),
    dataIndex: "isActive",
    key: "isActive",
    align: "center",
    width: 130,
    render: (active) =>
      active ? (
        <Tag
          icon={<CheckCircleOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
          }}
        >
          Hoạt động
        </Tag>
      ) : (
        <Tag
          icon={<CloseCircleOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
          }}
        >
          Đã khóa
        </Tag>
      ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        👑 Quyền hạn
      </div>
    ),
    dataIndex: "role",
    key: "role",
    align: "center",
    width: 130,
    render: (role) =>
      role === "ADMIN" ? (
        <Tag
          icon={<CrownOutlined />}
          className="font-bold px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            color: "white",
          }}
        >
          👑 ADMIN
        </Tag>
      ) : role === "MANAGER" ? (
        <Tag
          icon={<UserSwitchOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            color: "white",
          }}
        >
          🔧 MANAGER
        </Tag>
      ) : (
        <Tag
          icon={<UserOutlined />}
          className="font-medium px-3 py-1 rounded-full border-0"
          style={{
            background: "linear-gradient(135deg, #6b7280, #4b5563)",
            color: "white",
          }}
        >
          👤 USER
        </Tag>
      ),
  },
  {
    title: (
      <div className="flex items-center justify-center font-semibold text-gray-700">
        ⚙️ Hành động
      </div>
    ),
    key: "action",
    align: "center",
    width: 200,
    render: (_, record) => (
      <Space size="small">
        <Button
          type="primary"
          size="middle"
          className="!bg-gradient-to-r !from-blue-500 !to-indigo-600 hover:!from-blue-600 hover:!to-indigo-700 !border-0 !font-medium !rounded-lg !shadow-md hover:!shadow-lg !transition-all !duration-300"
          onClick={() => onUpdate(record)}
        >
          ✏️ Sửa
        </Button>
        <Button
          disabled={record.isActive}
          size="middle"
          className={`!font-medium !rounded-lg !transition-all !duration-300 ${
            record.isActive
              ? "!bg-gray-100 !text-gray-400 !border-gray-200 !cursor-not-allowed"
              : "!bg-gradient-to-r !from-green-500 !to-emerald-600 hover:!from-green-600 hover:!to-emerald-700 !border-0 !text-white !shadow-md hover:!shadow-lg"
          }`}
          onClick={() => onReactivate(record)}
        >
          🔄 Kích hoạt
        </Button>
      </Space>
    ),
  },
];

const ManageUser = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [updateModal, setUpdateModal] = useState({
    visible: false,
    user: null,
  });
  const [updateForm, setUpdateForm] = useState({
    role: "",
    isActive: true,
    isVerified: true,
  });
  const [reload, setReload] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Reset page về 1 khi search/filter
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchEmail, searchRole]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.current,
          pageSize: pagination.pageSize,
        };
        if (searchEmail) params.search = searchEmail;
        if (searchRole) params.role = searchRole;
        const result = await dispatch(adminAPI.getUsers(params));
        setUsers(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.totalCount,
        }));
      } catch (err) {
        message.error("Không thể tải danh sách người dùng");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [
    dispatch,
    searchEmail,
    searchRole,
    reload,
    pagination.current,
    pagination.pageSize,
  ]);

  // Helper to reload user list after update/delete/reactivate
  const reloadUsers = () => setReload((r) => r + 1);

  const handleUpdate = (user) => {
    setUpdateForm({
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    });
    setUpdateModal({ visible: true, user });
  };

  const handleUpdateOk = async () => {
    setLoading(true);
    try {
      const userId = updateModal.user.userId;
      await dispatch(adminAPI.UpdateUser(userId, updateForm));
      message.success("Cập nhật thành công");
      setUpdateModal({ visible: false, user: null });
      reloadUsers();
    } catch (err) {
      message.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateCancel = () =>
    setUpdateModal({ visible: false, user: null });

  // Reactivate user
  const handleReactivate = async (user) => {
    if (user.isActive) return;
    setLoading(true);
    try {
      await dispatch(adminAPI.ReactivateUser(user.userId));
      message.success("Kích hoạt lại thành công");
      reloadUsers();
    } catch (err) {
      message.error("Kích hoạt lại thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
            <UserOutlined className="text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">
              Quản trị hệ thống
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-lg text-gray-600">
            Quản lý thông tin và phân quyền người dùng trong hệ thống
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm theo email
              </label>
              <Input
                placeholder="Nhập email để tìm kiếm..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                allowClear
                prefix={<UserOutlined className="text-gray-400" />}
              />
            </div>

            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lọc theo quyền
              </label>
              <Select
                placeholder="Chọn quyền"
                value={searchRole || undefined}
                onChange={setSearchRole}
                allowClear
                className="w-full h-11"
                style={{
                  borderRadius: "12px",
                }}
              >
                <Option value="">Tất cả quyền</Option>
                {getUniqueRoles(users).map((role) => (
                  <Option key={role} value={role}>
                    {role === "ADMIN"
                      ? "👑 ADMIN"
                      : role === "MANAGER"
                      ? "🔧 MANAGER"
                      : "👤 USER"}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex items-end">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                {users?.length || 0} người dùng
              </div>
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <UserOutlined className="mr-2" />
              Danh sách người dùng
            </h3>
          </div>

          <Table
            dataSource={users || []}
            columns={columns(handleUpdate, handleReactivate)}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                setPagination((p) => ({ ...p, current: page, pageSize })),
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} người dùng`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            loading={loading}
            rowKey="userId"
            size="middle"
            className="!border-none"
            scroll={{ x: 1000 }}
          />
        </div>
        <Modal
          title={
            <div className="flex items-center text-xl font-bold text-gray-800">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                <UserOutlined className="text-white" />
              </div>
              Cập nhật thông tin người dùng
            </div>
          }
          open={updateModal.visible}
          onOk={handleUpdateOk}
          onCancel={handleUpdateCancel}
          okText="💾 Lưu thay đổi"
          cancelText="❌ Hủy bỏ"
          width={600}
          className="!top-20"
          okButtonProps={{
            className:
              "!bg-gradient-to-r !from-blue-500 !to-indigo-600 hover:!from-blue-600 hover:!to-indigo-700 !border-0 !h-10 !px-6 !font-medium !rounded-lg",
            size: "large",
          }}
          cancelButtonProps={{
            className:
              "!border-gray-300 !text-gray-600 hover:!border-gray-400 hover:!text-gray-700 !h-10 !px-6 !font-medium !rounded-lg",
            size: "large",
          }}
        >
          <div className="space-y-6 pt-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center mb-2">
                <CrownOutlined className="text-blue-600 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Phân quyền hệ thống
                </label>
              </div>
              <Select
                value={updateForm.role}
                onChange={(v) => setUpdateForm((f) => ({ ...f, role: v }))}
                className="w-full h-11"
                placeholder="Chọn quyền cho người dùng"
              >
                <Option value="USER">
                  <div className="flex items-center">
                    <span className="mr-2">👤</span>
                    <div>
                      <div className="font-medium">USER</div>
                      <div className="text-xs text-gray-500">
                        Người dùng thông thường
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value="MANAGER">
                  <div className="flex items-center">
                    <span className="mr-2">🔧</span>
                    <div>
                      <div className="font-medium">MANAGER</div>
                      <div className="text-xs text-gray-500">
                        Quản lý cấp trung
                      </div>
                    </div>
                  </div>
                </Option>
                <Option value="ADMIN">
                  <div className="flex items-center">
                    <span className="mr-2">👑</span>
                    <div>
                      <div className="font-medium">ADMIN</div>
                      <div className="text-xs text-gray-500">
                        Quản trị viên hệ thống
                      </div>
                    </div>
                  </div>
                </Option>
              </Select>
            </div>

            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center mb-2">
                <CheckCircleOutlined className="text-green-600 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Trạng thái hoạt động
                </label>
              </div>
              <Select
                value={updateForm.isActive}
                onChange={(v) => setUpdateForm((f) => ({ ...f, isActive: v }))}
                className="w-full h-11"
                placeholder="Chọn trạng thái"
              >
                <Option value={true}>
                  <div className="flex items-center text-green-600">
                    <CheckCircleOutlined className="mr-2" />
                    <span className="font-medium">
                      Hoạt động - Cho phép truy cập hệ thống
                    </span>
                  </div>
                </Option>
                <Option value={false}>
                  <div className="flex items-center text-red-600">
                    <CloseCircleOutlined className="mr-2" />
                    <span className="font-medium">
                      Đã khóa - Chặn truy cập hệ thống
                    </span>
                  </div>
                </Option>
              </Select>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <div className="flex items-center mb-2">
                <CheckCircleOutlined className="text-yellow-600 mr-2" />
                <label className="text-sm font-semibold text-gray-700">
                  Trạng thái xác thực
                </label>
              </div>
              <Select
                value={updateForm.isVerified}
                onChange={(v) =>
                  setUpdateForm((f) => ({ ...f, isVerified: v }))
                }
                className="w-full h-11"
                placeholder="Chọn trạng thái xác thực"
              >
                <Option value={true}>
                  <div className="flex items-center text-green-600">
                    <CheckCircleOutlined className="mr-2" />
                    <span className="font-medium">Đã xác thực email</span>
                  </div>
                </Option>
                <Option value={false}>
                  <div className="flex items-center text-orange-600">
                    <CloseCircleOutlined className="mr-2" />
                    <span className="font-medium">Chưa xác thực email</span>
                  </div>
                </Option>
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUser;
