import { BufferMemory } from "langchain/memory";
import { MongoDBChatMessageHistory } from "langchain/stores/message/mongodb";
import { RoomModel } from '../db_schemas/chat.js';

class ChatMemory {

    chatMemory = {};

    async getChatMemoryByRoomId(roomId){
        if(this.chatMemory[roomId]){
            return this.chatMemory[roomId];
        }else{
            const memory = await this.trainModelWithMemory(roomId);
            this.chatMemory[roomId] = memory;
            console.log("returning memory");
            return memory;
        }
    }

    async trainModelWithMemory(roomId){
        try{
            const roomObject = await RoomModel.findOne({roomId:roomId});
            const sessionId = roomObject._id;
            const collection = await RoomModel.prototype.collection;
            const memory = new BufferMemory({
                chatHistory: new MongoDBChatMessageHistory({
                    collection,
                    sessionId,
                }),
            });
            return memory;
        }
        catch(err){
            console.log(err);
        }
    }

    deleteMemory(roomId){
        delete this.chatMemory[roomId];
    }

}

export const chatMemory = new ChatMemory();