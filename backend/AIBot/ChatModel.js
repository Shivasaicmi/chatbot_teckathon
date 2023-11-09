import {ChatOpenAI} from 'langchain/chat_models/openai';
import dotenv from "dotenv";
import {OpenAI} from 'langchain/llms/openai';


dotenv.config();

export const chatAgent = new ChatOpenAI({
    openAIApiKey:process.env.OPEN_API_KEY
});


export const openAiModel = new OpenAI({
    temperature:0,
    openAIApiKey:process.env.OPEN_API_KEY,
    modelName:'text-curie-001'
})

