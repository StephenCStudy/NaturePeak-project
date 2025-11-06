import React, { useEffect, useState } from "react";
import axios from "axios";

type Post = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  type?: string;
  images?: string[];
};

const HomePage: React.FC = () => {
  const [location, setLocation] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = async (filterObj?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const filter = filterObj
        ? JSON.stringify(filterObj)
        : JSON.stringify({ featured: true });
      const res = await axios.get(
        `/api/posts?filter=${encodeURIComponent(filter)}`
      );
      const data: Post[] = res.data || [];
      setPosts(data.slice(0, 3));
    } catch (err: any) {
      setError(err?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load: featured posts
    fetchFeatured();
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const f: Record<string, unknown> = {};
    if (location) f.location = location;
    if (typeFilter) f.type = typeFilter;
    if (price) f.price = price;
    if (area) f.area = area;
    fetchFeatured(f);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-4">Find properties</h2>

      <form
        onSubmit={onSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
      >
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="border rounded px-3 py-2"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Any type</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (max)"
          className="border rounded px-3 py-2"
        />

        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area (m² min)"
          className="border rounded px-3 py-2"
        />

        <div className="md:col-span-4 flex items-center space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setLocation("");
              setTypeFilter("");
              setPrice("");
              setArea("");
              fetchFeatured();
            }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>
        </div>
      </form>

      <section>
        <h3 className="text-2xl font-semibold mb-3">Featured</h3>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.length === 0 && !loading && (
            <p className="text-gray-600">No featured posts found.</p>
          )}

          {posts.map((p) => (
            <article
              key={p._id}
              className="border rounded overflow-hidden bg-white"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {p.images && p.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="object-cover w-full h-48"
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
      </section>
    </div>
  );
};

export default HomePage;
