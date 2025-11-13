import api from "./api";

export interface AgentDoc {
  _id: string;
  name: string;
  email: string;
  phone: string;
  agency?: string;
  agentcyImg?: string;
}

export interface PropertyDoc {
  _id: string;
  title: string;
  location?: string;
  price?: number;
  images?: string[];
}

export interface AgentContact {
  name: string;
  email?: string;
  phone?: string;
  lastMessageAt?: string;
}

export interface MessageDoc {
  _id: string;
  propertyId: PropertyDoc;
  senderName: string;
  senderEmail?: string;
  senderPhone: string;
  recipientUserId: { _id: string; name: string; email: string };
  message: string;
  isRead: boolean;
  createdAt: string;
}

const agentService = {
  async findByEmail(email: string) {
    const res = await api.get<AgentDoc>(`/agents/by-email`, {
      params: { email },
    });
    return res.data;
  },

  async getProperties(params: {
    agentId?: string;
    agentEmail?: string;
    search?: string;
    contactName?: string;
    page?: number;
    limit?: number;
  }) {
    const res = await api.get<{ properties: PropertyDoc[]; pagination: any }>(
      `/properties`,
      {
        params,
      }
    );
    return res.data;
  },

  async getContactsByAgentEmail(email: string, page = 1, limit = 4) {
    const res = await api.get<{ contacts: AgentContact[]; pagination: any }>(
      `/messages/agent-contacts`,
      { params: { email, page, limit } }
    );
    return res.data;
  },

  async getSentMessages(email: string, page = 1, limit = 10) {
    const res = await api.get<{ messages: MessageDoc[]; pagination: any }>(
      `/messages/sent-by-agent`,
      {
        params: { email, page, limit },
      }
    );
    return res.data;
  },

  async getAgentReceivedMessages(email: string, page = 1, limit = 10) {
    const res = await api.get<{ messages: MessageDoc[]; pagination: any }>(
      `/messages/for-agent`,
      { params: { email, page, limit } }
    );
    return res.data;
  },

  async sendMessageFromAgent(payload: {
    agentEmail: string;
    propertyId: string;
    recipientEmail?: string;
    recipientEmails?: string[];
    message: string;
  }) {
    const res = await api.post(`/messages/from-agent`, payload);
    return res.data;
  },
};

export default agentService;
