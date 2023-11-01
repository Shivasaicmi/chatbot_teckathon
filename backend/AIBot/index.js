import {LLMChain} from 'langchain/chains';
import { PromptTemplate } from "langchain/prompts";
import { openAiModel } from "./ChatModel.js";


async function respondToTheMessage(message){
    const template = `User is trying to chat with you takein this message and reply to the message is {message}`;

    const prompt = new PromptTemplate({template,inputVariables:['message']});

    const chain = new LLMChain({llm:openAiModel,prompt});
    const response = await chain.call({message:message});
    return response;
}



export const chatBot = {
    respondToTheMessage
}

