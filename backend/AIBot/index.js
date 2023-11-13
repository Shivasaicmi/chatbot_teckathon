import { openAiModel } from "./ChatModel.js";
import { chatMemory } from "./chatMemory.js";
import {cachedRunnables} from "./cacheTrainSessions.js";
import { SimpleSequentialChain } from "langchain/chains";
import { ConversationChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";


async function getChatChain(roomId){
    return cachedRunnables.getRunnable(roomId);
}
let partialVariable = `You are a chat bot. Your job is to help the employee, 
who works in an IT company, in classifying the greviance 
raised by user into the respective departments. If you are not 
clear with the message and cannot classify it , make sure to ask
 back questions to better understand the message. Dont answer to irrelavant messages other than grievances `;

 partialVariable = `You are chat bot designed to respond only to the greivances raised by IT employees, Dont respond to other type of messages.
    When an employee asks something try to classify the grievance and respond with a suitable department name, employee's message is {input}`

 let messageVarible = "employee's message is {input}";
 messageVarible = partialVariable + messageVarible;

async function getConversationChain(roomId){
    const memory = await chatMemory.getChatMemoryByRoomId(roomId);
    const new_prompt = new PromptTemplate({
        template:messageVarible,
        inputVariables:['input'],
        partialVariables:partialVariable

    });
    console.log(new_prompt);
    const conversationChain = new ConversationChain({ llm: openAiModel, memory:memory,prompt:new_prompt });
    return conversationChain;
}


async function respondWithContext(roomId,message){
    console.log("recieved message");
    
    const memoizedResponse = await (await getConversationChain(roomId)).call({input:message})
    console.log(memoizedResponse);
    console.log("responding to the message");
    return memoizedResponse;
}

function chatWithUser(roomId){

}

export const chatBot = {
    respondWithContext
}
