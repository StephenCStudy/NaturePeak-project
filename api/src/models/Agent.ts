import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  // password added so agents can authenticate
  password: { type: String },
  agency: { type: String },
  agentcyImg: { type: String },
});

export default mongoose.model("Agent", agentSchema);
