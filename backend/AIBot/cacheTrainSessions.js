import { PromptTemplate } from "langchain/prompts";
import { chatModel } from "./ChatModel.js";

class ChacheTrainSessions{
    chatSessions = {}; 

    initialChatPrompt = `You are a chat bot. Your job is to help the employee, 
                        who works in an IT company, in classifying the greviance 
                        raised by user into the respective departments. If you are not 
                        clear with the message and cannot classify it , make sure to ask
                         back questions to better understand the message, the user's chat is {employeeMessage} `;

    cacheRunnables(roomId){
        const propmt = PromptTemplate.fromTemplate(this.initialChatPrompt);
        const runnable = propmt.pipe(chatModel);
        this.chatSessions[roomId] = runnable;
        return this.chatSessions[roomId];
    }


    getRunnable(roomId){
        if(!this.chatSessions[roomId]){
            return this.cacheRunnables(roomId);
        }
        else{
            return this.chatSessions[roomId];
        }
    }

}


export const cachedRunnables = new ChacheTrainSessions();