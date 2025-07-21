import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { adminAPI } from "../../services/apiService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FaUsers, FaUserCheck, FaUserShield, FaUserTie, FaUser, FaUserClock, FaRegFilePowerpoint, FaRegFileVideo, FaChartBar, FaCrown } from "react-icons/fa";

function groupByMonth(data, valueKeys) {
  const grouped = {};
  data.forEach((item) => {
    const d = new Date(item.date);
    const key = `${d.getMonth() + 1}/${d.getFullYear()}`; // e.g. '7/2025'
    if (!grouped[key]) {
      grouped[key] = { month: key };
      valueKeys.forEach((k) => (grouped[key][k] = 0));
    }
    valueKeys.forEach((k) => (grouped[key][k] += item[k] || 0));
  });
  // Convert to array sorted by month
  return Object.values(grouped).sort((a, b) => {
    const [ma, ya] = a.month.split("/").map(Number);
    const [mb, yb] = b.month.split("/").map(Number);
    return ya !== yb ? ya - yb : ma - mb;
  });
}

const DashboardAdmin = () => {
  const dispatch = useDispatch();
  const [userStats, setUserStats] = useState(null);
  const [contentStats, setContentStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentTrendFilter, setContentTrendFilter] = useState("month"); // 'month' or 'year'
  const [userTrendFilter, setUserTrendFilter] = useState("month"); // 'month' or 'year'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userRes, contentRes] = await Promise.all([
          dispatch(adminAPI.DashboardUser()),
          dispatch(adminAPI.DashboardContent()),
        ]);
        setUserStats(userRes.result);
        setContentStats(contentRes.result);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (loading)
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  // Format data for recharts
  const now = new Date();
  const registrationTrendRaw = userStats?.registrationTrend || [];
  let registrationTrendData = registrationTrendRaw;
  if (userTrendFilter === "month") {
    registrationTrendData = registrationTrendRaw.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    registrationTrendData = registrationTrendData.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      newUsers: item.newUsers,
    }));
  } else if (userTrendFilter === "year") {
    registrationTrendData = registrationTrendRaw.filter((item) => {
      const d = new Date(item.date);
      return d.getFullYear() === now.getFullYear();
    });
    registrationTrendData = groupByMonth(registrationTrendData, [
      "newUsers",
    ]).map((item) => ({
      date: item.month,
      newUsers: item.newUsers,
    }));
  }

  // Filter content trend data
  const contentTrendRaw = contentStats?.generationTrend || [];
  let contentTrendData = contentTrendRaw;
  if (contentTrendFilter === "month") {
    contentTrendData = contentTrendRaw.filter((item) => {
      const d = new Date(item.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
    contentTrendData = contentTrendData.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      slides: item.slidesGenerated,
      videos: item.videosGenerated,
    }));
  } else if (contentTrendFilter === "year") {
    contentTrendData = contentTrendRaw.filter((item) => {
      const d = new Date(item.date);
      return d.getFullYear() === now.getFullYear();
    });
    contentTrendData = groupByMonth(contentTrendData, [
      "slidesGenerated",
      "videosGenerated",
    ]).map((item) => ({
      date: item.month,
      slides: item.slidesGenerated,
      videos: item.videosGenerated,
    }));
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUsers className="text-gray-400 text-xl" />
          <div>
            <div className="text-base font-semibold">Tổng người dùng</div>
            <div className="text-xl font-bold">{userStats?.totalUsers ?? "-"}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUserClock className="text-green-500 text-xl" />
          <div>
            <div className="text-base font-semibold">Đang hoạt động</div>
            <div className="text-xl font-bold text-green-600">{userStats?.activeUsers ?? "-"}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUserCheck className="text-blue-500 text-xl" />
          <div>
            <div className="text-base font-semibold">Đã xác thực</div>
            <div className="text-xl font-bold text-blue-600">{userStats?.verifiedUsers ?? "-"}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUserShield className="text-purple-500 text-xl" />
          <div>
            <div className="text-base font-semibold">Admin</div>
            <div className="text-lg">{userStats?.usersByRole?.adminUsers ?? "-"}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUserTie className="text-yellow-500 text-xl" />
          <div>
            <div className="text-base font-semibold">Manager</div>
            <div className="text-lg">{userStats?.usersByRole?.managerUsers ?? "-"}</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
          <FaUser className="text-gray-500 text-xl" />
          <div>
            <div className="text-base font-semibold">Người dùng thường</div>
            <div className="text-lg">{userStats?.usersByRole?.regularUsers ?? "-"}</div>
          </div>
        </div>
      </div>
      {/* User Registration Trend as Bar Chart with Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Xu hướng đăng ký người dùng</h2>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={userTrendFilter}
            onChange={(e) => setUserTrendFilter(e.target.value)}
          >
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={registrationTrendData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#8884d8" name="Người dùng mới" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <FaRegFilePowerpoint className="text-purple-500 text-2xl" />
          <div>
            <div className="text-base font-semibold mb-1">Tổng số slide</div>
            <div className="text-2xl font-bold">{contentStats?.slides?.total ?? "-"}</div>
            <div className="text-xs text-gray-500">
              Hoàn thành: {contentStats?.slides?.completed ?? "-"} | Đang xử lý: {contentStats?.slides?.processing ?? "-"} | Thất bại: {contentStats?.slides?.failed ?? "-"}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <FaRegFileVideo className="text-blue-500 text-2xl" />
          <div>
            <div className="text-base font-semibold mb-1">Tổng số video</div>
            <div className="text-2xl font-bold">{contentStats?.videos?.total ?? "-"}</div>
            <div className="text-xs text-gray-500">
              Hoàn thành: {contentStats?.videos?.completed ?? "-"} | Đang xử lý: {contentStats?.videos?.processing ?? "-"} | Thất bại: {contentStats?.videos?.failed ?? "-"}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <FaChartBar className="text-green-500 text-2xl" />
          <div>
            <div className="text-base font-semibold mb-1">Slide/video tháng này</div>
            <div className="text-xl">{contentStats?.slides?.generatedThisMonth ?? 0} / {contentStats?.videos?.generatedThisMonth ?? 0}</div>
          </div>
        </div>
      </div>
      {/* Content Generation Trend as Bar Chart with Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Xu hướng tạo nội dung</h2>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={contentTrendFilter}
            onChange={(e) => setContentTrendFilter(e.target.value)}
          >
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={contentTrendData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="slides" fill="#82ca9d" name="Slide tạo mới" />
              <Bar dataKey="videos" fill="#8884d8" name="Video tạo mới" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaCrown className="text-yellow-500 text-lg" />
            <h2 className="text-base font-semibold">Top tạo slide</h2>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {contentStats?.topSlideGenerators?.map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.generatedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <FaCrown className="text-blue-500 text-lg" />
            <h2 className="text-base font-semibold">Top tạo video</h2>
          </div>
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {contentStats?.topVideoGenerators?.map((user, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.generatedCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
