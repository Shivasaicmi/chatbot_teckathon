import { pull } from "langchain/hub";
import { PromptTemplate } from "langchain/prompts";
import { renderTextDescription } from "langchain/tools/render";
import { formatLogToString } from "langchain/agents/format_scratchpad/log";
import {knowledgeBaseTool} from '../Tools/KnowledgeBaseTool.js';
import {chatModel} from "../Models/model.js";
import { AgentExecutor } from "langchain/agents";
import {chatMemory} from "../chatMemory.js"
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { RunnableSequence } from "langchain/schema/runnable";
import { ReActSingleInputOutputParser } from "langchain/agents/react/output_parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const chatAgentTemplate = fs.readFileSync(__dirname+'/chatAgentPrompt.txt','utf-8').toString();
const chatAgentPrompt = new PromptTemplate({
    template:chatAgentTemplate,
    inputVariables:['input','tools','tool_names','chat_history','agent_scratchpad']
});



const tools = [knowledgeBaseTool];
const toolNames = tools.map((tool)=>tool.name);
const promptWithInputs = await chatAgentPrompt.partial({
    tools:renderTextDescription(tools),
    tool_names:toolNames.join(',')
})

const runnableAgent = RunnableSequence.from([
    {
      input: (i) => i.input,
      agent_scratchpad: (i) => formatLogToString(i.steps),
      chat_history: (i) => i.chat_history,
    },
    promptWithInputs,
    chatModel,
    new ReActSingleInputOutputParser({ toolNames }),
  ]);




export async function getAgent(roomId){
    const executor = AgentExecutor.fromAgentAndTools({
        agent: runnableAgent,
        tools,
        memory:await chatMemory.getChatMemoryByRoomId(roomId),
    });
    return executor;
}
  
  

