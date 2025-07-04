import { GoogleGenerativeAI } from '@google/generative-ai';
import { Store } from 'tauri-plugin-store-api';

let settingsStoreInstance: Store | null = null;
let genAI: GoogleGenerativeAI | null = null;

async function getSettingsStore(): Promise<Store> {
	if (!settingsStoreInstance) {
		settingsStoreInstance = new Store('.settings.dat');
	}
	return settingsStoreInstance;
}

export async function getApiKeyFromStore(): Promise<string | null> {
	const store = await getSettingsStore();
	return await store.get('apiKey');
}

export async function saveApiKeyToStore(apiKey: string): Promise<void> {
	const store = await getSettingsStore();
	await store.set('apiKey', apiKey);
	await store.save();
}

export async function getCliPathFromStore(): Promise<string | null> {
	const store = await getSettingsStore();
	return await store.get('cliPath');
}

export async function saveCliPathToStore(cliPath: string): Promise<void> {
	const store = await getSettingsStore();
	await store.set('cliPath', cliPath);
	await store.save();
}

async function ensureGenAIInitialized() {
	if (!genAI) {
		const apiKey = await getApiKeyFromStore();
		if (apiKey) {
			genAI = new GoogleGenerativeAI(apiKey);
		}
	}
}

export async function sendMessageToGemini(message: string, history: any[]) {
	await ensureGenAIInitialized();
	
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