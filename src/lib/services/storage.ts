import { Store } from '@tauri-apps/plugin-store';
import type { Session, AppSettings } from '$lib/types';

class StorageService {
	private settingsStore: Store | null = null;
	private sessionsStore: Store | null = null;

	private async getSettingsStore(): Promise<Store> {
		if (!this.settingsStore) {
			this.settingsStore = new Store('.settings.dat');
		}
		return this.settingsStore;
	}

	private async getSessionsStore(): Promise<Store> {
		if (!this.sessionsStore) {
			this.sessionsStore = new Store('.sessions.dat');
		}
		return this.sessionsStore;
	}

	// Settings methods
	async getSettings(): Promise<AppSettings> {
		try {
			const store = await this.getSettingsStore();
			const apiKey = await store.get<string>('apiKey');
			const cliPath = await store.get<string>('cliPath');
			const selectedModel = await store.get<string>('selectedModel') || 'gemini-pro';
			const theme = await store.get<'light' | 'dark' | 'system'>('theme') || 'system';

			return {
				apiKey: apiKey || null,
				cliPath: cliPath || null,
				selectedModel,
				theme
			};
		} catch (error) {
			console.error('Failed to load settings:', error);
			return {
				apiKey: null,
				cliPath: null,
				selectedModel: 'gemini-pro',
				theme: 'system'
			};
		}
	}

	async saveSettings(settings: Partial<AppSettings>): Promise<void> {
		try {
			const store = await this.getSettingsStore();
			
			if (settings.apiKey !== undefined) {
				await store.set('apiKey', settings.apiKey);
			}
			if (settings.cliPath !== undefined) {
				await store.set('cliPath', settings.cliPath);
			}
			if (settings.selectedModel !== undefined) {
				await store.set('selectedModel', settings.selectedModel);
			}
			if (settings.theme !== undefined) {
				await store.set('theme', settings.theme);
			}
			
			await store.save();
		} catch (error) {
			console.error('Failed to save settings:', error);
			throw new Error('Failed to save settings');
		}
	}

	// Sessions methods
	async getSessions(): Promise<Session[]> {
		try {
			const store = await this.getSessionsStore();
			const sessions = await store.get<Session[]>('sessions') || [];
			
			// Convert date strings back to Date objects
			return sessions.map(session => ({
				...session,
				createdAt: new Date(session.createdAt),
				updatedAt: new Date(session.updatedAt),
				messages: session.messages.map(msg => ({
					...msg,
					timestamp: new Date(msg.timestamp)
				}))
			}));
		} catch (error) {
			console.error('Failed to load sessions:', error);
			return [];
		}
	}

	async saveSessions(sessions: Session[]): Promise<void> {
		try {
			const store = await this.getSessionsStore();
			await store.set('sessions', sessions);
			await store.save();
		} catch (error) {
			console.error('Failed to save sessions:', error);
			throw new Error('Failed to save sessions');
		}
	}

	async saveSession(session: Session): Promise<void> {
		try {
			const sessions = await this.getSessions();
			const existingIndex = sessions.findIndex(s => s.id === session.id);
			
			if (existingIndex >= 0) {
				sessions[existingIndex] = { ...session, updatedAt: new Date() };
			} else {
				sessions.push(session);
			}
			
			await this.saveSessions(sessions);
		} catch (error) {
			console.error('Failed to save session:', error);
			throw new Error('Failed to save session');
		}
	}

	async deleteSession(sessionId: string): Promise<void> {
		try {
			const sessions = await this.getSessions();
			const filteredSessions = sessions.filter(s => s.id !== sessionId);
			await this.saveSessions(filteredSessions);
		} catch (error) {
			console.error('Failed to delete session:', error);
			throw new Error('Failed to delete session');
		}
	}
}

export const storageService = new StorageService();