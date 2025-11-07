import React, { useEffect, useState } from "react";
import axios from "axios";

type Post = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  images?: string[];
};

const ListingPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, limit };
      if (location) params.location = location;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minArea) params.minArea = minArea;
      if (maxArea) params.maxArea = maxArea;

      const res = await axios.get("/api/posts", { params });

      // support multiple response shapes
      let items: Post[] = [];
      let totalCount = 0;

      if (Array.isArray(res.data)) {
        items = res.data;
        totalCount = res.data.length;
      } else if (res.data && Array.isArray(res.data.posts)) {
        items = res.data.posts;
        totalCount = res.data.total || items.length;
      } else if (res.data && Array.isArray(res.data.data)) {
        items = res.data.data;
        totalCount = res.data.total || items.length;
      } else {
        // fallback
        items = res.data?.items || [];
        totalCount = res.data?.total || items.length;
      }

      setPosts(items);
      setTotal(Number(totalCount));
    } catch (err: any) {
      setError(err?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Listings</h2>

      <form
        onSubmit={onApplyFilters}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6"
      >
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded px-3 py-2 md:col-span-2"
        />

        <input
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min Price"
          className="border rounded px-3 py-2"
        />

        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Max Price"
          className="border rounded px-3 py-2"
        />

        <input
          value={minArea}
          onChange={(e) => setMinArea(e.target.value)}
          placeholder="Min Area (m²)"
          className="border rounded px-3 py-2"
        />

        <input
          value={maxArea}
          onChange={(e) => setMaxArea(e.target.value)}
          placeholder="Max Area (m²)"
          className="border rounded px-3 py-2"
        />

        <div className="md:col-span-5 flex items-center space-x-3 mt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => {
              setLocation("");
              setMinPrice("");
              setMaxPrice("");
              setMinArea("");
              setMaxArea("");
              setPage(1);
              fetchPosts();
            }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <article
            key={p._id}
            className="border rounded overflow-hidden bg-white"
          >
            <div className="h-40 bg-gray-100 flex items-center justify-center">
              {p.images && p.images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="object-cover w-full h-40"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-lg">{p.title}</h4>
              <p className="text-sm text-gray-500">{p.location}</p>
              <p className="mt-2 font-bold">
                {p.price
                  ? `${p.price.toLocaleString()} VND`
                  : "Contact for price"}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-3 mt-6">
        <button
          onClick={() => setPage((s) => Math.max(1, s - 1))}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <div>
          Page {page} / {totalPages}
        </div>

        <button
          onClick={() => setPage((s) => Math.min(totalPages, s + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListingPage;
