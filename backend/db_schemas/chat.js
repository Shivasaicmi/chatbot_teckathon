import mongoose from "mongoose";


const roomSchema = mongoose.Schema({
    roomName:String,
    userEmail:String,
    users:[String],
    status:{
        type:String,
        enum:['active','inactive'],
        default:'active'
    },
    roomId:{
        type:String,
        unique:true
    },
    messages:[Object]
});


export const RoomModel = new mongoose.model('rooms',roomSchema);

