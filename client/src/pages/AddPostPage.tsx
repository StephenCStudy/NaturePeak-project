import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (error) => reject(error);
  });

const AddPostPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    try {
      const b64 = await Promise.all(arr.map((f) => toBase64(f)));
      setImages((s) => [...s, ...b64]);
      const objectUrls = arr.map((f) => URL.createObjectURL(f));
      setPreviewUrls((s) => [...s, ...objectUrls]);
    } catch (err) {
      toast.error("Failed to read files");
    }
  };

  const onRemoveImage = (index: number) => {
    setImages((s) => s.filter((_, i) => i !== index));
    const removed = previewUrls[index];
    if (removed) URL.revokeObjectURL(removed);
    setPreviewUrls((s) => s.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: any = {
        title,
        description,
        price: price ? Number(price) : undefined,
        area: area ? Number(area) : undefined,
        location,
        type,
        images,
      };

      const token = localStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      await axios.post("/api/posts", payload, { headers });
      toast.success("Post created successfully");
      setTimeout(() => navigate("/myposts"), 800);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Add Post</h2>

      <form
        onSubmit={onSubmit}
        className="space-y-4 bg-white p-4 rounded shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            placeholder="Beautiful 2BR apartment in district X"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            placeholder="Describe the property, amenities, nearby transport..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              placeholder="e.g. 1500000000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (m²)
            </label>
            <input
              placeholder="e.g. 75"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              placeholder="District, City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onFiles(e.target.files)}
          />

          {previewUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3">
              {previewUrls.map((url, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`preview-${i}`}
                    className="w-full h-28 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            disabled={loading}
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPostPage;
