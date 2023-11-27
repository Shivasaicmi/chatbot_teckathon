import { DynamicTool } from "langchain/tools";
import {store} from '../KnowledgeBase/docStore.js';

const getKnowledgeBaseTool =()=> {
    return new DynamicTool({
        name:'KnowledgeBase',
        description:`call this to the right department to approach. Call it with a {grievanceSummary} parameter. search for departname and department email `,
        func: async (grievanceSummary)=>{
            try{
                const response =  await store.getResponseFromKnowledgeBase(grievanceSummary);
                console.log(response.text);
                return response.text;
            }
            catch(err){
                console.log(err);
            }
        }
    })
}

const knowledgeBaseTool = getKnowledgeBaseTool();

export {knowledgeBaseTool};