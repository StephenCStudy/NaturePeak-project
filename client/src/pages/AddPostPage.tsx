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
    <div className="min-h-screen bg-gradient-natural py-12 px-4">
      <ToastContainer position="top-right" />

      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-heading font-bold text-[#083344] mb-3">
            Create New Listing
          </h2>
          <p className="text-lg text-(--text-muted)">
            Share your property with potential buyers or renters
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-3xl shadow-card overflow-hidden border border-(--color-pastel)"
        >
          <div className="p-10 space-y-8">
            {/* Title */}
            <div>
              <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                Property Title *
              </label>
              <input
                placeholder="Beautiful 2BR apartment in district X"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none hover:border-(--color-primary)"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                Description
              </label>
              <textarea
                placeholder="Describe the property, amenities, nearby transport..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none resize-none hover:border-(--color-primary)"
              />
            </div>

            {/* Price and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                  💰 Price (VND)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 1500000000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none hover:border-(--color-primary)"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                  📐 Area (m²)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 75"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none hover:border-(--color-primary)"
                />
              </div>
            </div>

            {/* Location and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                  📍 Location
                </label>
                <input
                  placeholder="District, City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none hover:border-(--color-primary)"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                  🏷️ Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border-2 border-(--color-pastel) rounded-xl px-5 py-4 text-base focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-pastel) transition-all outline-none bg-white hover:border-(--color-primary) cursor-pointer"
                >
                  <option value="">Select type</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-base font-semibold text-[#083344] mb-3 font-heading">
                📷 Property Images
              </label>
              <div className="border-2 border-dashed border-(--color-pastel) rounded-xl p-8 text-center hover:border-(--color-primary) hover:bg-(--color-cream) transition-all">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <svg
                    className="w-16 h-16 text-(--color-primary) mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-base text-[#083344] font-semibold">
                    Click to upload images
                  </span>
                  <span className="text-sm text-(--text-muted) mt-2">
                    PNG, JPG, GIF up to 10MB
                  </span>
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={url}
                        alt={`preview-${i}`}
                        className="w-full h-36 object-cover rounded-xl shadow-card border-2 border-(--color-pastel) group-hover:border-(--color-primary) transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow-lg transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-(--color-cream) px-10 py-6 flex items-center justify-between border-t-2 border-(--color-pastel)">
            <button
              type="button"
              onClick={() => navigate("/posts")}
              className="btn-outline px-8 py-3 text-base"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="btn-primary px-10 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Listing...
                </span>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPostPage;

