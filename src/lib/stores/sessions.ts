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

let sessionsStoreInstance: Store | null = null;

async function getSessionsStore(): Promise<Store> {
	if (!sessionsStoreInstance) {
		sessionsStoreInstance = new Store('.sessions.dat');
	}
	return sessionsStoreInstance;
}

const createSessionsStore = () => {
	const { subscribe, set, update } = writable<Session[]>([]);

	return {
		subscribe,
		load: async () => {
			const store = await getSessionsStore();
			const sessions = (await store.get<Session[]>('sessions')) || [];
			set(sessions);
		},
		addSession: async (session: Session) => {
			const store = await getSessionsStore();
			update((sessions) => {
				const newSessions = [...sessions, session];
				store.set('sessions', newSessions);
				store.save();
				return newSessions;
			});
		},
		deleteSession: async (id: string) => {
			const store = await getSessionsStore();
			update((sessions) => {
				const newSessions = sessions.filter((s) => s.id !== id);
				store.set('sessions', newSessions);
				store.save();
				return newSessions;
			});
		},
		updateSession: async (id: string, updatedSession: Partial<Session>) => {
			const store = await getSessionsStore();
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