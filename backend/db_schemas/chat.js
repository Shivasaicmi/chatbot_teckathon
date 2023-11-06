import mongoose from "mongoose";


const roomSchema = mongoose.Schema({
    roomName:String,
    userEmail:String,
    users:[String],
    roomId:{
        type:String,
        unique:true
    },
});


export const RoomModel = new mongoose.model('rooms',roomSchema);

