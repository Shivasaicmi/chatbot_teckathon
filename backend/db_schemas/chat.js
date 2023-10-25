import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    userName:String,
    message:String,
    timeStamp:Date
 })

const roomSchema = mongoose.Schema({
    roomName:String,
    userEmail:String,
    users:[String],
    roomId:{
        type:String,
        unique:true
    },
    chats:[messageSchema]
});


export const RoomModel = new mongoose.model('rooms',roomSchema);

