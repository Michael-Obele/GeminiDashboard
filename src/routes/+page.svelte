<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessions, activeSessionId } from '$lib/stores/sessions';

	onMount(async () => {
		// Wait for sessions to load
		await sessions.load();
		
		const firstSession = $sessions[0];
		if (firstSession) {
			activeSessionId.set(firstSession.id);
			goto(`/chat/${firstSession.id}`);
		} else {
			// Create a new session if none exist
			try {
				const newSession = await sessions.create();
				activeSessionId.set(newSession.id);
				goto(`/chat/${newSession.id}`);
			} catch (error) {
				console.error('Failed to create initial session:', error);
			}
		}
	});
</script>

<div class="flex h-full items-center justify-center">
	<div class="text-center">
		<h2 class="text-2xl font-bold mb-2">Welcome to Gemini GUI</h2>
		<p class="text-muted-foreground">Loading your chats...</p>
	</div>
</div>