import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { generalAPI } from "../services/apiService";

const ImageManager = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ category: "", grade: "", chapter: "" });
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setError(null);
    setImages([]);
    if (!form.category || !form.grade || !form.chapter) {
      setError("Vui lòng nhập đầy đủ cả 3 trường category, grade, chapter!");
      return;
    }
    setLoading(true);
    try {
      const params = { ...form, limit: 20 };
      const res = await dispatch(generalAPI.getImages(params));
      let arr = [];
      if (Array.isArray(res?.data)) {
        arr = res.data;
      }
      setImages(arr);
    } catch (e) {
      setError(e?.message || "Không thể tải ảnh");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quản lý Ảnh</h2>
      <form className="flex flex-col md:flex-row gap-4 mb-4" onSubmit={handleSearch}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4"
        />
        <input
          type="text"
          name="grade"
          placeholder="Grade"
          value={form.grade}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4"
        />
        <input
          type="text"
          name="chapter"
          placeholder="Chapter"
          value={form.chapter}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition md:w-1/6"
        >
          Tìm kiếm
        </button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading && <div>Đang tải ảnh...</div>}
      {/* Chỉ hiển thị kết quả khi đã tìm kiếm và có ít nhất 1 trường được nhập */}
      {searched && !loading && !error && images.length === 0 && (
        <div className="text-gray-500">Không có ảnh nào phù hợp.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={img.id || idx} className="border rounded p-2 flex flex-col items-center">
            {img.url && (
              <img src={img.url} alt={img.name || "Ảnh"} className="w-32 h-32 object-cover mb-2" />
            )}
            <div className="text-sm text-gray-700 truncate w-full text-center">{img.name || img.fileName || "(Không tên)"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager; 