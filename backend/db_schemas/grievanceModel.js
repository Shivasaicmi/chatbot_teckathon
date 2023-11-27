import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
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
  roomId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['active','inactive'],
    default:'active'
  },
  grievanceName:{
    type:String,
    required:true
  }
});

const GrievanceModel = mongoose.model("Grievance", grievanceSchema);

export default GrievanceModel;
