<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { sessions } from '$lib/stores/sessions';

	onMount(async () => {
		await sessions.load();
		const firstSession = $sessions[0];
		if (firstSession) {
			goto(`/chat/${firstSession.id}`);
		} else {
			const newSession = {
				id: crypto.randomUUID(),
				name: 'New Chat',
				messages: []
			};
			sessions.addSession(newSession);
			goto(`/chat/${newSession.id}`);
		}
	});
</script>
