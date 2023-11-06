import {LLMChain} from 'langchain/chains';
import { PromptTemplate } from "langchain/prompts";
import { openAiModel } from "./ChatModel.js";
import { RoomModel } from '../db_schemas/chat.js';
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { MongoDBChatMessageHistory } from "langchain/stores/message/mongodb";

async function trainModelWithContext(roomId){
    console.log("querying for roomId",roomId);
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

