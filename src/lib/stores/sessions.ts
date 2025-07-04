import { writable, derived } from 'svelte/store';
import { storageService } from '$lib/services/storage';
import type { Session, Message } from '$lib/types';

function createSessionsStore() {
	const { subscribe, set, update } = writable<Session[]>([]);

	return {
		subscribe,
		
		async load(): Promise<void> {
			try {
				const sessions = await storageService.getSessions();
				set(sessions);
			} catch (error) {
				console.error('Failed to load sessions:', error);
				set([]);
			}
		},

		async create(name: string = 'New Chat'): Promise<Session> {
			const newSession: Session = {
				id: crypto.randomUUID(),
				name,
				messages: [],
				createdAt: new Date(),
				updatedAt: new Date()
			};

			try {
				await storageService.saveSession(newSession);
				update(sessions => [...sessions, newSession]);
				return newSession;
			} catch (error) {
				console.error('Failed to create session:', error);
				throw new Error('Failed to create session');
			}
		},

		async delete(sessionId: string): Promise<void> {
			try {
				await storageService.deleteSession(sessionId);
				update(sessions => sessions.filter(s => s.id !== sessionId));
			} catch (error) {
				console.error('Failed to delete session:', error);
				throw new Error('Failed to delete session');
			}
		},

		async update(sessionId: string, updates: Partial<Session>): Promise<void> {
			try {
				update(sessions => {
					const updatedSessions = sessions.map(session => {
						if (session.id === sessionId) {
							const updatedSession = { 
								...session, 
								...updates, 
								updatedAt: new Date() 
							};
							// Save to storage asynchronously
							storageService.saveSession(updatedSession).catch(console.error);
							return updatedSession;
						}
						return session;
					});
					return updatedSessions;
				});
			} catch (error) {
				console.error('Failed to update session:', error);
				throw new Error('Failed to update session');
			}
		},

		async addMessage(sessionId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
			const newMessage: Message = {
				...message,
				id: crypto.randomUUID(),
				timestamp: new Date()
			};

			try {
				update(sessions => {
					const updatedSessions = sessions.map(session => {
						if (session.id === sessionId) {
							const updatedSession = {
								...session,
								messages: [...session.messages, newMessage],
								updatedAt: new Date()
							};
							// Save to storage asynchronously
							storageService.saveSession(updatedSession).catch(console.error);
							return updatedSession;
						}
						return session;
					});
					return updatedSessions;
				});
			} catch (error) {
				console.error('Failed to add message:', error);
				throw new Error('Failed to add message');
			}
		}
	};
}

export const sessions = createSessionsStore();
export const activeSessionId = writable<string | null>(null);

// Derived store for the current active session
export const activeSession = derived(
	[sessions, activeSessionId],
	([$sessions, $activeSessionId]) => {
		if (!$activeSessionId) return null;
		return $sessions.find(session => session.id === $activeSessionId) || null;
	}
);