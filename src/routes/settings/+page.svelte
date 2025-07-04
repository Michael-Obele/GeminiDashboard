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
	import { settings } from '$lib/stores/settings';
	import { toast } from 'svelte-sonner';

	let apiKey = $state('');
	let cliPath = $state('');
	let selectedModel = $state('gemini-pro');
	let saving = $state(false);

	const availableModels = [
		{ value: 'gemini-pro', label: 'Gemini Pro' },
		{ value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
		{ value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
	];

	onMount(async () => {
		await settings.load();
		apiKey = $settings.apiKey || '';
		cliPath = $settings.cliPath || '';
		selectedModel = $settings.selectedModel;
	});

	async function saveSettings() {
		if (saving) return;
		
		saving = true;
		try {
			await settings.save({
				apiKey: apiKey || null,
				cliPath: cliPath || null,
				selectedModel
			});
			toast.success('Settings saved successfully');
		} catch (error) {
			console.error('Failed to save settings:', error);
			toast.error('Failed to save settings');
		} finally {
			saving = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
			saveSettings();
		}
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Settings</CardTitle>
		<CardDescription>Configure your Gemini API and CLI settings</CardDescription>
	</CardHeader>
	<CardContent class="space-y-6">
		<div class="space-y-4">
			<h3 class="text-lg font-medium">API Configuration</h3>
			
			<div class="space-y-2">
				<Label for="api-key">Gemini API Key</Label>
				<Input 
					id="api-key" 
					bind:value={apiKey} 
					type="password" 
					placeholder="Enter your Gemini API key"
					onkeydown={handleKeydown}
				/>
				<p class="text-sm text-muted-foreground">
					Get your API key from <a href="https://aistudio.google.com/apikey" target="_blank" class="text-primary hover:underline">Google AI Studio</a>
				</p>
			</div>

			<div class="space-y-2">
				<Label for="model-select">Model</Label>
				<select 
					id="model-select"
					bind:value={selectedModel}
					class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#each availableModels as model}
						<option value={model.value}>{model.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="space-y-4">
			<h3 class="text-lg font-medium">CLI Configuration</h3>
			
			<div class="space-y-2">
				<Label for="cli-path">Gemini CLI Path</Label>
				<Input
					id="cli-path"
					bind:value={cliPath}
					placeholder="e.g., /usr/local/bin/gemini or leave empty for system PATH"
					onkeydown={handleKeydown}
				/>
				<p class="text-sm text-muted-foreground">
					Full path to the Gemini CLI executable. Leave empty to use the system PATH.
				</p>
			</div>
		</div>

		<div class="flex gap-2 pt-4">
			<Button onclick={saveSettings} disabled={saving}>
				{#if saving}
					<svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Saving...
				{:else}
					Save Settings
				{/if}
			</Button>
			<Button variant="outline" onclick={() => window.location.reload()}>
				Reset
			</Button>
		</div>

		<div class="text-sm text-muted-foreground">
			<p><strong>Tip:</strong> Use Ctrl+Enter (Cmd+Enter on Mac) to quickly save settings</p>
		</div>
	</CardContent>
</Card>