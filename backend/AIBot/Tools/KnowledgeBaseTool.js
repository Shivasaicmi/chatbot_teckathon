import { DynamicTool } from "langchain/tools";
import {store} from '../KnowledgeBase/docStore.js';

const getKnowledgeBaseTool =()=> {
    return new DynamicTool({
        name:'KnowledgeBase',
        description:`call this to search for the department in the IT company to approach With the any kind of IT greivance raised by employee.  `,
        func: async ()=>{
            grievanceSummary = "I have network realted issues with my wifi. Which department should i approach"
            console.log("the grievance is "+grievanceSummary)
           const response =  await store.getResponseFromKnowledgeBase(grievanceSummary);
           console.log("The response from knowledgeBase is "+response);
           return "You should go With ICT department";
        }
    })
}

const knowledgeBaseTool = getKnowledgeBaseTool();

export {knowledgeBaseTool};