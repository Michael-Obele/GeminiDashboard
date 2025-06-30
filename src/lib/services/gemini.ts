import { GoogleGenerativeAI } from '@google/generative-ai';
import { Store } from 'tauri-plugin-store-api';

const store = new Store('.settings.dat');

let genAI: GoogleGenerativeAI | null = null;

async function getApiKey(): Promise<string | null> {
	return await store.get('apiKey');
}

async function initializeGenAI() {
	const apiKey = await getApiKey();
	if (apiKey) {
		genAI = new GoogleGenerativeAI(apiKey);
	} else {
		genAI = null;
	}
}

store.onKeyChange('apiKey', () => {
	initializeGenAI();
});

initializeGenAI();

export async function sendMessageToGemini(message: string, history: any[]) {
	if (!genAI) {
		throw new Error('API key not set. Please set it in the settings.');
	}

	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
	const chat = model.startChat({
		history
	});

	const result = await chat.sendMessage(message);
	const response = await result.response;
	const text = response.text();
	return text;
}
