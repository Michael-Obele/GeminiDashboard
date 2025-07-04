<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		getApiKeyFromStore,
		saveApiKeyToStore,
		getCliPathFromStore,
		saveCliPathToStore
	} from '$lib/services/gemini.js';

	let apiKey = $state('');
	let cliPath = $state('');

	async function loadSettings() {
		apiKey = (await getApiKeyFromStore()) ?? '';
		cliPath = (await getCliPathFromStore()) ?? '';
	}

	async function saveSettings() {
		await saveApiKeyToStore(apiKey);
		await saveCliPathToStore(cliPath);
	}

	onMount(() => {
		loadSettings();
	});
</script>

<Card>
	<CardHeader>
		<CardTitle>Settings</CardTitle>
		<CardDescription>Manage your application settings</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="space-y-2">
			<Label for="api-key">Gemini API Key</Label>
			<Input id="api-key" bind:value={apiKey} type="password" />
		</div>
		<div class="space-y-2">
			<Label for="cli-path">Gemini CLI Path</Label>
			<Input
				id="cli-path"
				bind:value={cliPath}
				placeholder="e.g., /home/user/.nvm/versions/node/v20.11.0/bin/gemini"
			/>
		</div>
		<Button onclick={saveSettings}>Save</Button>
	</CardContent>
</Card>