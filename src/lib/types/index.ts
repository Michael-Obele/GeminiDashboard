export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Date;
}

export interface Session {
	id: string;
	name: string;
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
}

export interface AppSettings {
	apiKey: string | null;
	cliPath: string | null;
	selectedModel: string;
	theme: 'light' | 'dark' | 'system';
}

export interface ApiError {
	message: string;
	code?: string;
	details?: any;
}