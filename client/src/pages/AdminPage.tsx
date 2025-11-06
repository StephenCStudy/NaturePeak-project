import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Post = {
  _id?: string;
  title: string;
  price?: number;
  location?: string;
  status?: "active" | "hidden";
};

const AdminPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/posts", { headers });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.posts || res.data.data || res.data.items || [];
      setPosts(data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (
    id: string | undefined,
    status: "active" | "hidden"
  ) => {
    if (!id) return;
    try {
      await axios.patch(`/api/posts/${id}/status`, { status }, { headers });
      toast.success("Status updated");
      fetchPosts();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to update status"
      );
    }
  };

  // prepare chart data: group by location counts
  const countsByLocation = posts.reduce<Record<string, number>>((acc, p) => {
    const loc = p.location || "Unknown";
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(countsByLocation),
    datasets: [
      {
        label: "Posts by location",
        data: Object.values(countsByLocation),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Posts overview</h3>
        {loading && <p>Loading...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-gray-600">No posts found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-4">
              {posts.map((p) => (
                <div
                  key={p._id}
                  className="border rounded p-3 bg-white flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="text-sm text-gray-500">{p.location}</p>
                    <p className="text-sm font-bold">
                      {p.price ? `${p.price.toLocaleString()} VND` : "Contact"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Status: {p.status || "active"}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => setStatus(p._id, "active")}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setStatus(p._id, "hidden")}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
                    >
                      Hide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Statistics by location</h4>
            {Object.keys(countsByLocation).length === 0 ? (
              <p className="text-gray-600">No data</p>
            ) : (
              <Bar data={chartData} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
