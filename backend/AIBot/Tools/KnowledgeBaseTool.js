import { DynamicTool } from "langchain/tools";
import {store} from '../KnowledgeBase/docStore.js';

const getKnowledgeBaseTool =()=> {
    return new DynamicTool({
        name:'fooTool',
        description:`call this to know the value of foo`,
        func: ()=>{
        //     grievanceSummary = "I have network realted issues with my wifi. Which department should i approach"
        //     console.log("the grievance is "+grievanceSummary)
        //    const response =  await store.getResponseFromKnowledgeBase(grievanceSummary);
        //    console.log("The response from knowledgeBase is "+response);
           return "shivasai";
        }
    })
}

const knowledgeBaseTool = getKnowledgeBaseTool();

export {knowledgeBaseTool};