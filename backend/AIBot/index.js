import { openAiModel } from "./Models/model.js";
import { chatMemory } from "./chatMemory.js";
import { ConversationChain } from "langchain/chains";
import {store} from './KnowledgeBase/docStore.js';
import {getAgent} from "../AIBot/ChatAgent/ChatAgent.js";

async function getConversationChain(roomId){
    try{
        const memory = await chatMemory.getChatMemoryByRoomId(roomId);
        console.log("got the memory");
        console.log("building the chain");
        const conversationChain = new ConversationChain({ llm: openAiModel, memory:memory });
        console.log("returning the ConversationChain");
        return conversationChain;
    }
    catch(err){
        console.log(err);
    }
}

async function respondWithContext(roomId,message){ 
   let memoizedResponse = null;
   try{
        const conversationChain = await getConversationChain(roomId);
        console.log("got the Conversation chain");
        console.log("calling the conversation chain");
        memoizedResponse = await conversationChain.call({input:message});
        console.log("got the response");
        console.log("returning the memoized response");
   }
   catch(err){
    console.log(err);
   }
    
    return memoizedResponse;
}

async function getChatAgentResponse(message){
    console.log("getting the agent");
    const agent = await getAgent();
    console.log("got the agent");
    try{
        console.log("calling the agent ");
        return await agent.call({input:message});
    }
    catch(err){
        console.log(err)
    }
}

export const chatBot = {
    respondWithContext,
    getChatAgentResponse
}
