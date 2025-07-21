import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Input, Select, Modal, message } from "antd";
import { useDispatch } from "react-redux";
import { adminAPI } from "../../services/apiService";
import { CheckCircleOutlined, CloseCircleOutlined, UserOutlined, CrownOutlined, UserSwitchOutlined } from "@ant-design/icons";

const { Option } = Select;

const getUniqueRoles = (data) => {
  const roles = data.map((u) => u.role);
  return Array.from(new Set(roles));
};

const columns = (onUpdate, onReactivate) => [
  {
    title: "ID",
    dataIndex: "userId",
    key: "userId",
    align: "center",
  },
  {
    title: "Họ tên",
    dataIndex: "fullName",
    key: "fullName",
    align: "center",
    width: 200,
    render: (text) => text || <i>(Chưa cập nhật)</i>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "center",
    width: 220,
  },
  {
    title: "Xác thực",
    dataIndex: "isVerified",
    key: "isVerified",
    align: "center",
    render: (verified) =>
      verified ? (
        <Tag color="lime" icon={<CheckCircleOutlined />}>Đã xác thực</Tag>
      ) : (
        <Tag color="orange" icon={<CloseCircleOutlined />}>Chưa xác thực</Tag>
      ),
  },
  {
    title: "Trạng thái",
    dataIndex: "isActive",
    key: "isActive",
    align: "center",
    render: (active) =>
      active ? (
        <Tag color="blue" icon={<CheckCircleOutlined />}>Hoạt động</Tag>
      ) : (
        <Tag color="volcano" icon={<CloseCircleOutlined />}>Đã khóa</Tag>
      ),
  },
  {
    title: "Quyền",
    dataIndex: "role",
    key: "role",
    align: "center",
    width: 100,
    render: (role) =>
      role === "ADMIN" ? (
        <Tag color="purple" icon={<CrownOutlined />}>ADMIN</Tag>
      ) : role === "MANAGER" ? (
        <Tag color="geekblue" icon={<UserSwitchOutlined />}>MANAGER</Tag>
      ) : (
        <Tag color="default" icon={<UserOutlined />}>USER</Tag>
      ),
  },
  {
    title: "Hành động",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Space>
        <Button
          type="primary"
          className="!bg-blue-500 hover:!bg-blue-600 !border-blue-500"
          onClick={() => onUpdate(record)}
        >
          Update
        </Button>
        <Button
          disabled={record.isActive}
          className="!bg-gray-200 !text-gray-400 !border-gray-200"
          onClick={() => onReactivate(record)}
        >
          Reactive
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
      await dispatch(
        adminAPI.UpdateUser(userId, updateForm)
      );
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 pt-8">
      <h2 className="text-center mb-8 text-3xl font-bold">
        Quản lý người dùng
      </h2>
      <div className="w-full flex flex-col items-center sticky top-20 z-10">
        <div className="w-full max-w-5xl mb-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            placeholder="Tìm kiếm email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="w-full md:w-1/2"
            allowClear
          />
          <Select
            placeholder="Chọn quyền"
            value={searchRole || undefined}
            onChange={setSearchRole}
            allowClear
            className="w-full md:w-1/4"
          >
            <Option value="">Tất cả</Option>
            {getUniqueRoles(users).map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>
        <div className="w-full max-w-6xl">
          <Table
            dataSource={users || []}
            columns={columns(
              handleUpdate,
              handleReactivate
            )}
            bordered
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: (page, pageSize) =>
                setPagination((p) => ({ ...p, current: page, pageSize })),
            }}
            className="rounded-xl shadow-lg bg-white"
            loading={loading}
            rowKey="userId"
            size="middle"
            style={{ borderRadius: 16, overflow: "hidden" }}
          />
        </div>
      </div>
      <Modal
        title="Cập nhật người dùng"
        open={updateModal.visible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 16 }}>
          <label>Quyền:</label>
          <Select
            value={updateForm.role}
            onChange={(v) => setUpdateForm((f) => ({ ...f, role: v }))}
            style={{ width: "100%" }}
          >
            <Option value="USER">USER</Option>
            <Option value="ADMIN">ADMIN</Option>
            <Option value="MANAGER">MANAGER</Option>
          </Select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Trạng thái:</label>
          <Select
            value={updateForm.isActive}
            onChange={(v) => setUpdateForm((f) => ({ ...f, isActive: v }))}
            style={{ width: "100%" }}
          >
            <Option value={true}>Hoạt động</Option>
            <Option value={false}>Đã khóa</Option>
          </Select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Xác thực:</label>
          <Select
            value={updateForm.isVerified}
            onChange={(v) => setUpdateForm((f) => ({ ...f, isVerified: v }))}
            style={{ width: "100%" }}
          >
            <Option value={true}>Đã xác thực</Option>
            <Option value={false}>Chưa xác thực</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUser;
