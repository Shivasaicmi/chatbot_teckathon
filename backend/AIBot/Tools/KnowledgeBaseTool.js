import { DynamicTool } from "langchain/tools";
import { chatModel } from "../model.js";

const KnowledgeBaseTool =()=> {
    return new DynamicTool({
        name:'KnowledgeBase',
        description:`call this to search for the answer in knowledgebase. 
                    The input should be a summary of grievance the employee is facing. Provide one parameter 'grievanceSummary' `,
        func: async (grievanceSummary)=>{

        }
    })
}

