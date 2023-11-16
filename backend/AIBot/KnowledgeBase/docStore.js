import dotenv from "dotenv";
dotenv.config();

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { chatModel } from "../Models/model.js";

class Store{
	embeddings = new OpenAIEmbeddings();
	knowledgeChain = null;
	constructor(){
		this.#createStore();
	}
	async #createStore() {
		const vectorstore = await FaissStore.load('./AIBot/KnowledgeBase/',this.embeddings);
		this.knowledgeChain = new RetrievalQAChain({
			combineDocumentsChain:loadQAStuffChain(chatModel),
			retriever:vectorstore.asRetriever(),
			returnSourceDocuments:true,
		})
	}

	async getResponseFromKnowledgeBase(message){
		console.log("searching in knowledge base ......................................................................");
		message = `/n The employee is trying to raise a greivance. the input is his greivance, take this greivance and suggest a department to the employee /n . The grievance is ${message} `;
		return await this.knowledgeChain.call({
			query:message
		});
	}

}

export const store = new Store();
