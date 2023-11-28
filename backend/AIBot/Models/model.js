import {ChatOpenAI} from 'langchain/chat_models/openai';
import dotenv from "dotenv";
import {OpenAI} from 'langchain/llms/openai';


dotenv.config();

export const chatModel = new ChatOpenAI({
    temperature:0,
    openAIApiKey:process.env.OPEN_API_KEY,
    modelName:'gpt-4-1106-preview',
    stop:["\nObservation"]
});

export const openAiModel = new OpenAI({
    temperature:0,
    openAIApiKey:process.env.OPEN_API_KEY,
    modelName:'gpt-4-1106-preview'
})
