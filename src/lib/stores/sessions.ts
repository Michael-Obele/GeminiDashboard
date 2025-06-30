import { writable } from 'svelte/store';
import { Store } from 'tauri-plugin-store-api';

export interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
}

export interface Session {
	id: string;
	name: string;
	messages: Message[];
}

const store = new Store('.sessions.dat');

const createSessionsStore = () => {
	const { subscribe, set, update } = writable<Session[]>([]);

	return {
		subscribe,
		load: async () => {
			const sessions = (await store.get<Session[]>('sessions')) || [];
			set(sessions);
		},
		addSession: (session: Session) => {
			update((sessions) => {
				const newSessions = [...sessions, session];
				store.set('sessions', newSessions);
				store.save();
				return newSessions;
			});
		},
		deleteSession: (id: string) => {
			update((sessions) => {
				const newSessions = sessions.filter((s) => s.id !== id);
				store.set('sessions', newSessions);
				store.save();
				return newSessions;
			});
		},
		updateSession: (id: string, updatedSession: Partial<Session>) => {
			update((sessions) => {
				const newSessions = sessions.map((s) =>
					s.id === id ? { ...s, ...updatedSession } : s
				);
				store.set('sessions', newSessions);
				store.save();
				return newSessions;
			});
		}
	};
};

export const sessions = createSessionsStore();

export const activeSessionId = writable<string | null>(null);
