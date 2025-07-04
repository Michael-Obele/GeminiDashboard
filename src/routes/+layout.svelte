<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { MessageSquare, Settings, Info, TerminalSquare, Plus, Trash2 } from 'lucide-svelte';
	import { sessions, activeSessionId } from '$lib/stores/sessions';
	import { settings } from '$lib/stores/settings';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { toast } from 'svelte-sonner';

	let currentPath = $state('');

	$effect(() => {
		currentPath = $page.url.pathname;
	});

	onMount(async () => {
		try {
			await Promise.all([
				sessions.load(),
				settings.load()
			]);
		} catch (error) {
			console.error('Failed to initialize app:', error);
			toast.error('Failed to load application data');
		}
	});

	const navItems = [
		{ path: '/cli', label: 'CLI', icon: TerminalSquare },
		{ path: '/settings', label: 'Settings', icon: Settings },
		{ path: '/about', label: 'About', icon: Info }
	];

	async function createNewChat() {
		try {
			const newSession = await sessions.create();
			activeSessionId.set(newSession.id);
			goto(`/chat/${newSession.id}`);
		} catch (error) {
			console.error('Failed to create new chat:', error);
			toast.error('Failed to create new chat');
		}
	}

	async function deleteSession(sessionId: string, event: Event) {
		event.preventDefault();
		event.stopPropagation();
		
		try {
			await sessions.delete(sessionId);
			if ($activeSessionId === sessionId) {
				activeSessionId.set(null);
				goto('/');
			}
			toast.success('Chat deleted');
		} catch (error) {
			console.error('Failed to delete session:', error);
			toast.error('Failed to delete chat');
		}
	}
</script>

<Toaster />
<ModeWatcher />

<div class="flex h-screen bg-background text-foreground">
	<aside class="w-64 flex-shrink-0 border-r bg-muted/40 p-4">
		<div class="flex h-full flex-col">
			<div class="mb-4 flex items-center justify-between">
				<h1 class="text-xl font-bold">Gemini GUI</h1>
				<Button variant="ghost" size="icon" onclick={createNewChat}>
					<Plus class="h-4 w-4" />
				</Button>
			</div>

			<div class="flex-1 space-y-2 overflow-y-auto">
				<p class="px-3 text-xs font-medium uppercase text-muted-foreground">Chats</p>
				{#each $sessions as session (session.id)}
					<a
						href={`/chat/${session.id}`}
						class={cn(
							'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium',
							$activeSessionId === session.id
								? 'bg-primary text-primary-foreground'
								: 'hover:bg-accent'
						)}
					>
						<span class="truncate">{session.name}</span>
						<Button
							variant="ghost"
							size="icon"
							class="h-6 w-6"
							onclick={(e) => deleteSession(session.id, e)}
						>
							<Trash2 class="h-4 w-4" />
						</Button>
					</a>
				{/each}
			</div>

			<nav class="mt-4 flex flex-col gap-1 border-t pt-4">
				{#each navItems as item}
					<Button
						variant={currentPath === item.path ? 'default' : 'ghost'}
						class={cn(
							'w-full justify-start gap-2 rounded-md px-3 text-left',
							currentPath === item.path && 'font-semibold'
						)}
						onclick={() => goto(item.path)}
					>
						<svelte:component this={item.icon} class="h-4 w-4" />
						{item.label}
					</Button>
				{/each}
			</nav>
		</div>
	</aside>
	<main class="flex-1 overflow-y-auto p-6">
		<slot />
	</main>
</div>