import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  summary: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;
