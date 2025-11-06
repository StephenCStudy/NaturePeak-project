import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Post = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  type?: string;
  images?: string[];
  status?: "active" | "hidden";
};

const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

const MyPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Post>>({});

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const userPayload: any = parseJwt(token);
  const userId = userPayload?.id || userPayload?._id || null;

  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchPosts = async () => {
    if (!userId) {
      toast.warning("No user token found. Please login.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get("/api/posts", {
        params: { userId },
        headers,
      });
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

  const startEdit = (p: Post) => {
    setEditingId(p._id || null);
    setEditValues({
      title: p.title,
      price: p.price,
      location: p.location,
      area: p.area,
      description: p.description,
      type: p.type,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id?: string) => {
    if (!id) return;
    try {
      await axios.put(`/api/posts/${id}`, editValues, { headers });
      toast.success("Post updated");
      setEditingId(null);
      fetchPosts();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to update"
      );
    }
  };

  const removePost = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this post?")) return;
    try {
      await axios.delete(`/api/posts/${id}`, { headers });
      toast.success("Post deleted");
      fetchPosts();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to delete"
      );
    }
  };

  const toggleStatus = async (id?: string) => {
    if (!id) return;
    try {
      await axios.patch(`/api/posts/${id}/status`, {}, { headers });
      toast.success("Status updated");
      fetchPosts();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to update status"
      );
    }
  };

  return (
    <div className="container mx-auto px-4">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">My Posts</h2>

      {loading && <p>Loading...</p>}

      {!loading && posts.length === 0 && (
        <p className="text-gray-600">You have no posts yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <div key={p._id} className="border rounded bg-white overflow-hidden">
            <div className="p-4">
              {editingId === p._id ? (
                <div className="space-y-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editValues.title || ""}
                    onChange={(e) =>
                      setEditValues((s) => ({ ...s, title: e.target.value }))
                    }
                  />
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={String(editValues.price ?? "")}
                    onChange={(e) =>
                      setEditValues((s) => ({
                        ...s,
                        price: Number(e.target.value || 0),
                      }))
                    }
                  />
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={editValues.location || ""}
                    onChange={(e) =>
                      setEditValues((s) => ({ ...s, location: e.target.value }))
                    }
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveEdit(p._id)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 border rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-sm text-gray-500">{p.location}</p>
                  <p className="mt-2 font-bold">
                    {p.price
                      ? `${p.price.toLocaleString()} VND`
                      : "Contact for price"}
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    Status: {p.status || "active"}
                  </p>
                  <div className="mt-3 flex items-center space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removePost(p._id)}
                      className="px-3 py-1 border rounded text-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleStatus(p._id)}
                      className="px-3 py-1 border rounded"
                    >
                      Toggle Hide
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPostsPage;
