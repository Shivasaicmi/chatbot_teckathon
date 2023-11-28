import { DynamicTool } from "langchain/tools";
import { store } from "../KnowledgeBase/docStore.js";

const getKnowledgeBaseTool = () => {
  return new DynamicTool({
    name: "KnowledgeBase",
    description: `call this to the right department to approach. Call it with a {grievanceSummary} and {locationOfHuman} parameter.search for department name and department email with similar location`,
    func: async (grievanceSummary) => {
      try {
        const response = await store.getResponseFromKnowledgeBase(
          grievanceSummary
        );
        console.log(response.text);
        return response.text;
      } catch (err) {
        console.log(err);
      }
    },
  });
};

const knowledgeBaseTool = getKnowledgeBaseTool();

export { knowledgeBaseTool };
