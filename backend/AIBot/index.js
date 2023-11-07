import { openAiModel } from "./ChatModel.js";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { MongoDBChatMessageHistory } from "langchain/stores/message/mongodb";
import { RoomModel } from '../db_schemas/chat.js';


async function trainModelWithContext(roomId){
    console.log("querying for roomId",roomId);
    console.log(roomId);
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

async function respondWithContext(roomId,message){
    console.log("recieved message");
    const memory = await trainModelWithContext(roomId);
    const chain = new ConversationChain({ llm: openAiModel, memory });
    const response = await chain.call({input:message});
    console.log("responding to the message");
    return response;
}

export const chatBot = {
    respondWithContext
}
