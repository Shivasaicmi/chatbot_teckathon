import { openAiModel } from "./model.js";
import { chatMemory } from "./chatMemory.js";
import { ConversationChain } from "langchain/chains";
import {createStore} from './KnowledgeBase/docStore.js';

async function getConversationChain(roomId){
    try{
        const memory = await chatMemory.getChatMemoryByRoomId(roomId);
        const conversationChain = new ConversationChain({ llm: openAiModel, memory:memory });
        return conversationChain;
    }
    catch(err){
        console.log(err);
    }
}

async function respondWithContext(roomId,message){ 
    const memoizedResponse = await (await getConversationChain(roomId)).call({input:message})
    console.log(await createStore.getResponseFromKnowledgeBase(message));
    return memoizedResponse;
}


export const chatBot = {
    respondWithContext
}
