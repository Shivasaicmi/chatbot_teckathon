import { openAiModel } from "./ChatModel.js";
import { ConversationChain } from "langchain/chains";
import { chatMemory } from "./chatMemory.js";
import { PromptTemplate } from "langchain/prompts";


async function respondWithContext(roomId,message){
    console.log("recieved message");
    // const promptTemplate = new PromptTemplate({
    //     inputVariables:['grievance'],
    //     template: `The user is an employee of an IT company,
    //                 and trying to log a grievance ,help the user , the user prompt is {grievance}, If the user prompt seems irrelavant, respond with some questions or ask user to give the relavant prompt  `
    // })
    const memory = await chatMemory.getChatMemoryByRoomId(roomId);
    const chain = new ConversationChain({ llm: openAiModel, memory:memory });
    const response = await chain.call({input:message});
    console.log("responding to the message");
    return response;
}


export const chatBot = {
    respondWithContext
}
