import React, { useEffect, useMemo, useState } from "react";
import {
  HiUserGroup,
  HiOfficeBuilding,
  HiBell,
  HiInbox,
  HiPaperAirplane,
  HiUser,
  HiMail,
  HiPhone,
  HiSearch,
  HiTrash,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agentService from "../../services/agentService";
import api from "../../services/api";
import type {
  AgentDoc,
  AgentContact,
  PropertyDoc,
  MessageDoc,
} from "../../services/agentService";

const AgentPage: React.FC = () => {
  const navigate = useNavigate();
  const [agent, setAgent] = useState<AgentDoc | null>(null);
  const [tab, setTab] = useState<"contacts" | "posts" | "notifications">(
    "contacts"
  );
  const [notifTab, setNotifTab] = useState<"inbox" | "send">("inbox");

  const [contacts, setContacts] = useState<AgentContact[]>([]);
  const [contactsPage, setContactsPage] = useState(1);
  const [contactsPagination, setContactsPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 0,
  });
  const [properties, setProperties] = useState<PropertyDoc[]>([]);
  const [allProperties, setAllProperties] = useState<PropertyDoc[]>([]); // All properties for dropdown
  const [postsPage, setPostsPage] = useState(1);
  const [postsPagination, setPostsPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 0,
  });
  const [postSearchTitle, setPostSearchTitle] = useState("");
  const [postSearchContact, setPostSearchContact] = useState("");
  const [sent, setSent] = useState<MessageDoc[]>([]);
  const [sentPage, setSentPage] = useState(1);
  const [sentPagination, setSentPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
  });
  const [inbox, setInbox] = useState<MessageDoc[]>([]);
  const [inboxPage, setInboxPage] = useState(1);
  const [inboxPagination, setInboxPagination] = useState({
    page: 1,
    limit: 3,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // compose message
  const [composePropertyId, setComposePropertyId] = useState("");
  const [composeRecipientEmail, setComposeRecipientEmail] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [propertyContactEmails, setPropertyContactEmails] = useState<string[]>(
    []
  );

  const agentEmail = useMemo(
    () => sessionStorage.getItem("agentEmail") || "",
    []
  );
  const agentId = useMemo(() => sessionStorage.getItem("agentId") || "", []);

  useEffect(() => {
    const ensureAgent = async () => {
      if (!agentEmail) {
        navigate("/agent/login");
        return;
      }
      try {
        const a = await agentService.findByEmail(agentEmail);
        setAgent(a);
      } catch {
        toast.error("Không tìm thấy đại lý");
        sessionStorage.removeItem("agentEmail");
        sessionStorage.removeItem("agentId");
        navigate("/agent/login");
      }
    };
    ensureAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      if (!agentEmail) return;
      setLoading(true);
      try {
        const [contactsRes, propsRes, allPropsRes, sentRes, inboxRes] =
          await Promise.all([
            agentService.getContactsByAgentEmail(agentEmail, contactsPage, 4),
            agentService.getProperties({
              agentId,
              page: postsPage,
              limit: 6,
              search: postSearchTitle || undefined,
              contactName: postSearchContact || undefined,
            }),
            // Fetch ALL properties for dropdown (no pagination)
            agentService.getProperties({
              agentId,
              page: 1,
              limit: 1000, // Get all properties
            }),
            agentService.getSentMessages(agentEmail, sentPage, 3),
            agentService.getAgentReceivedMessages(agentEmail, inboxPage, 3),
          ]);
        setContacts(contactsRes.contacts);
        setContactsPagination(contactsRes.pagination);
        setProperties(propsRes.properties);
        setPostsPagination(
          propsRes.pagination || {
            page: postsPage,
            limit: 6,
            total: propsRes.properties?.length || 0,
            totalPages: 1,
          }
        );
        setAllProperties(allPropsRes.properties); // Store all properties for dropdown
        setSent(sentRes.messages);
        setSentPagination(
          sentRes.pagination || {
            page: sentPage,
            limit: 3,
            total: sentRes.messages?.length || 0,
            totalPages: 1,
          }
        );
        setInbox(inboxRes.messages);
        setInboxPagination(inboxRes.pagination);
        if (allPropsRes.properties.length > 0) {
          const firstPropId = allPropsRes.properties[0]._id;
          setComposePropertyId(firstPropId);
          // Fetch contacts for first property
          fetchPropertyContacts(firstPropId);
        }
      } catch (e) {
        // no-op
      } finally {
        setLoading(false);
      }
    };
    if (agentId && agentEmail) fetchAll();
  }, [
    agentEmail,
    agentId,
    contactsPage,
    inboxPage,
    postsPage,
    postSearchTitle,
    postSearchContact,
    sentPage,
  ]);

  const fetchPropertyContacts = async (propertyId: string) => {
    if (!propertyId) {
      setPropertyContactEmails([]);
      setComposeRecipientEmail("");
      return;
    }
    try {
      const emails: string[] = [];

      // Get property details directly by ID to ensure userId is populated
      try {
        const propResponse = await api.get(`/properties/${propertyId}`);
        const propDetails = propResponse.data;

        // Check if property has userId with email
        const userIdObj = propDetails?.userId;
        if (userIdObj && typeof userIdObj === "object" && userIdObj.email) {
          emails.push(userIdObj.email);
        }
      } catch (err) {
        console.warn("Could not fetch property details:", err);
      }

      // Also get all messages for this property to find other contacts
      const allMessages = await agentService.getAgentReceivedMessages(
        agentEmail,
        1,
        1000 // Get all to filter by property
      );

      // Filter messages for this specific property and extract unique sender emails
      const senderEmails = allMessages.messages
        .filter((m) => {
          // Handle both string and object propertyId
          const msgPropertyId =
            typeof m.propertyId === "string" ? m.propertyId : m.propertyId?._id;
          return msgPropertyId === propertyId && m.senderEmail;
        })
        .map((m) => m.senderEmail!)
        .filter((email, index, self) => self.indexOf(email) === index); // unique

      // Merge emails (userId email first, then senders)
      const allEmails = [...new Set([...emails, ...senderEmails])];

      console.log("Property ID:", propertyId);
      console.log("Owner email:", emails[0] || "none");
      console.log("Sender emails:", senderEmails);
      console.log("All emails:", allEmails);

      setPropertyContactEmails(allEmails);
      // Auto-fill recipient email with comma-separated list
      setComposeRecipientEmail(allEmails.join(", "));
    } catch (err) {
      console.error("Error fetching property contacts:", err);
      setPropertyContactEmails([]);
      setComposeRecipientEmail("");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentEmail || !composePropertyId || !composeMessage) return;
    try {
      const payload: any = {
        agentEmail,
        propertyId: composePropertyId,
        message: composeMessage,
      };
      if (composeRecipientEmail) {
        payload.recipientEmail = composeRecipientEmail;
      }
      await agentService.sendMessageFromAgent(payload);
      toast.success("Đã gửi tin nhắn");
      setComposeMessage("");
      setComposeRecipientEmail("");
      const sentRes = await agentService.getSentMessages(
        agentEmail,
        sentPage,
        3
      );
      setSent(sentRes.messages);
      setSentPagination(sentRes.pagination || sentPagination);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gửi thất bại");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Sử dụng endpoint riêng cho agent
      await api.delete(`/messages/agent/${messageId}`, {
        data: { agentEmail },
      });
      toast.success("Đã xóa tin nhắn");
      // Reload inbox
      const inboxRes = await agentService.getAgentReceivedMessages(
        agentEmail,
        inboxPage,
        3
      );
      setInbox(inboxRes.messages);
      setInboxPagination(inboxRes.pagination);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa tin nhắn thất bại");
    }
  };

  if (!agent)
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold">Đang tải thông tin đại lý...</h1>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-(--color-pastel) flex items-center justify-center border-2 border-(--color-primary)">
            <HiOfficeBuilding className="w-8 h-8 text-(--color-primary)" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-heading font-bold text-[#083344] mb-1">
              Bảng điều khiển Đại lý
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#134e4a]">
              <span className="flex items-center gap-1 font-semibold">
                <HiUser className="w-4 h-4" /> {agent.name}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <HiMail className="w-4 h-4" /> {agent.email}
              </span>
              {agent.phone && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <HiPhone className="w-4 h-4" /> {agent.phone}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto">
        <button
          onClick={() => setTab("contacts")}
          className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            tab === "contacts"
              ? "bg-[#2E7D32] text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]"
          }`}
        >
          <HiUserGroup className="w-5 h-5" /> Quản lý người liên hệ
        </button>
        <button
          onClick={() => setTab("posts")}
          className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            tab === "posts"
              ? "bg-[#2E7D32] text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]"
          }`}
        >
          <HiOfficeBuilding className="w-5 h-5" /> Quản lý bài đăng
        </button>
        <button
          onClick={() => setTab("notifications")}
          className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            tab === "notifications"
              ? "bg-[#2E7D32] text-white shadow-md"
              : "bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]"
          }`}
        >
          <HiBell className="w-5 h-5" /> Quản lý thông báo
        </button>
      </div>

      {tab === "contacts" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-5 text-[#2E7D32] border-b pb-3">
            Người liên hệ đại lý
          </h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-[#F9FBE7] rounded-lg">
              Chưa có liên hệ.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((c, idx) => (
                <div
                  key={idx}
                  className="p-5 border border-gray-200 rounded-lg bg-linear-to-br from-white to-[#F9FBE7] hover:shadow-md transition-shadow"
                >
                  <div className="font-semibold text-lg text-[#2E7D32] mb-2">
                    {c.name || "(Ẩn danh)"}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                    <span className="text-gray-400">📧</span>
                    {c.email || "(không email)"}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                    <span className="text-gray-400">📱</span>
                    {c.phone || "(không số)"}
                  </div>
                  {c.lastMessageAt && (
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      Gần nhất:{" "}
                      {new Date(c.lastMessageAt).toLocaleString("vi-VN")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {contactsPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setContactsPage(Math.max(1, contactsPage - 1))}
                disabled={contactsPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {contactsPage} / {contactsPagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setContactsPage(
                    Math.min(contactsPagination.totalPages, contactsPage + 1)
                  )
                }
                disabled={contactsPage === contactsPagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "posts" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-5 text-[#2E7D32] border-b pb-3">
            Bài đăng của đại lý
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm theo tên bài đăng
              </label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  placeholder="Ví dụ: Căn hộ cao cấp..."
                  value={postSearchTitle}
                  onChange={(e) => {
                    setPostsPage(1);
                    setPostSearchTitle(e.target.value);
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm theo tên người liên hệ
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  placeholder="Ví dụ: Nguyen Van A"
                  value={postSearchContact}
                  onChange={(e) => {
                    setPostsPage(1);
                    setPostSearchContact(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPostSearchTitle("");
                  setPostSearchContact("");
                  setPostsPage(1);
                }}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-[#F9FBE7] rounded-lg">
              Chưa có bài đăng gắn đại lý.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((p) => (
                <a
                  key={p._id}
                  href={`/properties/${p._id}`}
                  className="block p-5 border border-gray-200 rounded-lg bg-linear-to-br from-white to-[#F9FBE7] hover:shadow-lg hover:border-[#2E7D32] transition-all"
                >
                  <div className="font-semibold text-lg text-[#2E7D32] mb-2">
                    {p.title}
                  </div>
                  <div className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    {p.location}
                  </div>
                  {typeof p.price === "number" && (
                    <div className="text-base font-semibold text-[#795548] mt-3">
                      💰 {p.price.toLocaleString()} đ
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
          {postsPagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPostsPage(Math.max(1, postsPage - 1))}
                disabled={postsPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {postsPage} / {postsPagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPostsPage(
                    Math.min(postsPagination.totalPages, postsPage + 1)
                  )
                }
                disabled={postsPage === postsPagination.totalPages}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-5">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  notifTab === "inbox"
                    ? "bg-[#2E7D32] text-white shadow"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]"
                }`}
                onClick={() => setNotifTab("inbox")}
              >
                <HiInbox className="w-4 h-4" /> Tin nhắn được nhận
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                  notifTab === "send"
                    ? "bg-[#2E7D32] text-white shadow"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-[#2E7D32] hover:text-[#2E7D32]"
                }`}
                onClick={() => setNotifTab("send")}
              >
                <HiPaperAirplane className="w-4 h-4" /> Gửi thông báo
              </button>
            </div>

            {notifTab === "inbox" ? (
              <div>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Đang tải...
                  </div>
                ) : inbox.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-[#F9FBE7] rounded-lg">
                    Chưa có tin nhắn được nhận.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inbox.map((m) => (
                      <div
                        key={m._id}
                        className="p-5 border border-gray-200 rounded-lg bg-linear-to-br from-white to-[#F9FBE7] hover:shadow-md transition-shadow relative"
                      >
                        <button
                          onClick={() => handleDeleteMessage(m._id)}
                          className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa tin nhắn"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                        <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                          <span>🕐</span>
                          {new Date(m.createdAt).toLocaleString("vi-VN")}
                        </div>
                        <div className="font-semibold text-[#2E7D32] mb-2">
                          Bài đăng:{" "}
                          {typeof m.propertyId === "object" &&
                          m.propertyId?.title
                            ? m.propertyId.title
                            : "Không xác định"}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          <span className="font-medium">Người gửi:</span>{" "}
                          {m.senderName || "Ẩn danh"}
                          {m.senderEmail ? ` (${m.senderEmail})` : ""}
                        </div>
                        <div className="mt-3 p-3 bg-white rounded border-l-4 border-[#2E7D32] text-gray-700">
                          {m.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {inboxPagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() => setInboxPage(Math.max(1, inboxPage - 1))}
                      disabled={inboxPage === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Trước
                    </button>
                    <span className="text-sm text-gray-600">
                      Trang {inboxPage} / {inboxPagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setInboxPage(
                          Math.min(inboxPagination.totalPages, inboxPage + 1)
                        )
                      }
                      disabled={inboxPage === inboxPagination.totalPages}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm">
                    <span className="block mb-2 font-medium text-gray-700">
                      Bài đăng
                    </span>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                      value={composePropertyId}
                      onChange={(e) => {
                        const propId = e.target.value;
                        setComposePropertyId(propId);
                        fetchPropertyContacts(propId);
                      }}
                      required
                    >
                      {allProperties.length === 0 ? (
                        <option value="">Không có bài đăng</option>
                      ) : (
                        allProperties.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.title}
                          </option>
                        ))
                      )}
                    </select>
                  </label>
                  <label className="text-sm">
                    <span className="block mb-2 font-medium text-gray-700">
                      Email người nhận (tùy chọn)
                    </span>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                      placeholder="Nhập email hoặc nhiều email cách nhau bởi dấu phẩy"
                      value={composeRecipientEmail}
                      onChange={(e) => setComposeRecipientEmail(e.target.value)}
                    />
                    {propertyContactEmails.length === 0 &&
                      composePropertyId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Chưa có người liên hệ với bài đăng này
                        </p>
                      )}
                    {propertyContactEmails.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Tự động điền {propertyContactEmails.length} email từ bài
                        đăng này
                      </p>
                    )}
                  </label>
                  <label className="text-sm md:col-span-3">
                    <span className="block mb-2 font-medium text-gray-700">
                      Nội dung
                    </span>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                      rows={4}
                      value={composeMessage}
                      onChange={(e) => setComposeMessage(e.target.value)}
                      placeholder="Nhập nội dung gửi tới người dùng"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-[#2E7D32] text-white font-semibold rounded-lg hover:bg-[#1B5E20] transition-colors shadow-md inline-flex items-center gap-2"
                >
                  <HiPaperAirplane className="w-5 h-5" /> Gửi thông báo
                </button>
              </form>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-5 text-[#2E7D32] border-b pb-3">
              Thông báo đã gửi
            </h2>
            {sent.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-[#F9FBE7] rounded-lg">
                Chưa có thông báo đã gửi.
              </div>
            ) : (
              <div className="space-y-4">
                {sent.map((m) => (
                  <div
                    key={m._id}
                    className="p-5 border border-gray-200 rounded-lg bg-linear-to-br from-white to-[#F9FBE7] hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                      <span>🕐</span>
                      {new Date(m.createdAt).toLocaleString("vi-VN")}
                    </div>
                    <div className="font-semibold text-[#2E7D32] mb-2">
                      {m.propertyId?.title}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Tới:</span>{" "}
                      {m.recipientUserId?.name} ({m.recipientUserId?.email})
                    </div>
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-[#2E7D32] text-gray-700">
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {sentPagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  onClick={() => setSentPage(Math.max(1, sentPage - 1))}
                  disabled={sentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  ← Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {sentPage} / {sentPagination.totalPages}
                </span>
                <button
                  onClick={() =>
                    setSentPage(
                      Math.min(sentPagination.totalPages, sentPage + 1)
                    )
                  }
                  disabled={sentPage === sentPagination.totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentPage;
