import { writable } from 'svelte/store';
import { storageService } from '$lib/services/storage';
import { geminiService } from '$lib/services/gemini';
import type { AppSettings } from '$lib/types';

function createSettingsStore() {
	const { subscribe, set, update } = writable<AppSettings>({
		apiKey: null,
		cliPath: null,
		selectedModel: 'gemini-pro',
		theme: 'system'
	});

	return {
		subscribe,
		
		async load(): Promise<void> {
			try {
				const settings = await storageService.getSettings();
				set(settings);
			} catch (error) {
				console.error('Failed to load settings:', error);
			}
		},

		async save(updates: Partial<AppSettings>): Promise<void> {
			try {
				await storageService.saveSettings(updates);
				update(current => ({ ...current, ...updates }));
				
				// Refresh Gemini service if API key or model changed
				if (updates.apiKey !== undefined || updates.selectedModel !== undefined) {
					await geminiService.refreshConfiguration();
				}
			} catch (error) {
				console.error('Failed to save settings:', error);
				throw new Error('Failed to save settings');
			}
		}
	};
}

export const settings = createSettingsStore();