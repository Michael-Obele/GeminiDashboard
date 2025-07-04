import { GoogleGenerativeAI } from '@google/generative-ai';
import { storageService } from './storage';
import type { Message, ApiError } from '$lib/types';

class GeminiService {
	private genAI: GoogleGenerativeAI | null = null;
	private currentModel: string = 'gemini-pro';

	private async ensureInitialized(): Promise<void> {
		if (!this.genAI) {
			const settings = await storageService.getSettings();
			if (!settings.apiKey) {
				throw new Error('API key not configured. Please set it in the settings.');
			}
			
			this.genAI = new GoogleGenerativeAI(settings.apiKey);
			this.currentModel = settings.selectedModel;
		}
	}

	async sendMessage(message: string, history: Message[]): Promise<string> {
		try {
			await this.ensureInitialized();
			
			if (!this.genAI) {
				throw new Error('Gemini API not initialized');
			}

			const model = this.genAI.getGenerativeModel({ model: this.currentModel });
			
			// Convert our message format to Gemini's expected format
			const geminiHistory = history.map(msg => ({
				role: msg.role === 'assistant' ? 'model' : 'user',
				parts: [{ text: msg.content }]
			}));

			const chat = model.startChat({
				history: geminiHistory
			});

			const result = await chat.sendMessage(message);
			const response = await result.response;
			return response.text();
		} catch (error: any) {
			console.error('Gemini API error:', error);
			
			// Handle specific API errors
			if (error.message?.includes('API_KEY_INVALID')) {
				throw new Error('Invalid API key. Please check your settings.');
			} else if (error.message?.includes('QUOTA_EXCEEDED')) {
				throw new Error('API quota exceeded. Please try again later.');
			} else if (error.message?.includes('SAFETY')) {
				throw new Error('Content was blocked by safety filters.');
			} else {
				throw new Error(error.message || 'Failed to get response from Gemini');
			}
		}
	}

	async refreshConfiguration(): Promise<void> {
		this.genAI = null;
		await this.ensureInitialized();
	}
}

export const geminiService = new GeminiService();