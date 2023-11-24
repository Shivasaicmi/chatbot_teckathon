import {getAgent} from "../AIBot/ChatAgent/ChatAgent.js";


async function getChatAgentResponse(message,roomId){
    console.log("getting the agent");
    const agent = await getAgent(roomId);
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
    getChatAgentResponse
}
