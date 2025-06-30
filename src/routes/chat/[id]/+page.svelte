<script lang="ts">
	import { page } from '$app/stores';
	import { sessions, activeSessionId, type Message } from '$lib/stores/sessions';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Paperclip, Send } from 'lucide-svelte';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import { sendMessageToGemini } from '$lib/services/gemini';
	import { toast } from 'svelte-sonner';

	let message = $state('');
	let loading = $state(false);
	let currentSession = $derived(
		$sessions.find((s) => s.id === $page.params.id)
	);

	onMount(() => {
		activeSessionId.set($page.params.id);
	});

	async function sendMessage() {
		if (!currentSession || !message.trim()) return;

		const userMessage: Message = {
			id: crypto.randomUUID(),
			role: 'user',
			content: message
		};

		sessions.updateSession(currentSession.id, {
			messages: [...currentSession.messages, userMessage]
		});

		const messageToSend = message;
		message = '';
		loading = true;

		try {
			const history = currentSession.messages.map((m) => ({
				role: m.role,
				parts: [{ text: m.content }]
			}));

			const response = await sendMessageToGemini(messageToSend, history);

			const assistantMessage: Message = {
				id: crypto.randomUUID(),
				role: 'assistant',
				content: response
			};

			sessions.updateSession(currentSession.id, {
				messages: [...currentSession.messages, userMessage, assistantMessage]
			});
		} catch (error: any) {
			toast.error(error.message || 'An unknown error occurred.');
			// Revert user message on error
			sessions.updateSession(currentSession.id, {
				messages: currentSession.messages
			});
		} finally {
			loading = false;
		}
	}
</script>

{#if currentSession}
	<div class="flex h-full flex-col">
		<Card class="flex flex-1 flex-col">
			<CardHeader>
				<CardTitle>{currentSession.name}</CardTitle>
			</CardHeader>
			<CardContent class="flex-1 space-y-4 overflow-y-auto">
				{#each currentSession.messages as msg (msg.id)}
					<div class="flex items-start gap-4">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							{msg.role === 'user' ? 'You' : 'AI'}
						</div>
						<div class="prose dark:prose-invert max-w-none">
							<p>{msg.content}</p>
						</div>
					</div>
				{/each}
				{#if loading}
					<div class="flex items-start gap-4">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
						>
							AI
						</div>
						<div class="prose dark:prose-invert max-w-none">
							<p>Thinking...</p>
						</div>
					</div>
				{/if}
			</CardContent>
			<CardFooter class="border-t p-4">
				<form class="relative w-full" on:submit|preventDefault={sendMessage}>
					<Textarea
						bind:value={message}
						placeholder="Type your message here..."
						class="min-h-[48px] w-full resize-none rounded-2xl border border-neutral-400 bg-background p-4 pr-16 text-sm shadow-sm"
						disabled={loading}
					/>
					<div class="absolute bottom-3 right-3 flex gap-2">
						<Button type="submit" size="icon" disabled={!message || loading}>
							<Send class="h-4 w-4" />
							<span class="sr-only">Send</span>
						</Button>
						<Button variant="ghost" size="icon" disabled={loading}>
							<Paperclip class="h-4 w-4" />
							<span class="sr-only">Attach file</span>
						</Button>
					</div>
				</form>
			</CardFooter>
		</Card>
	</div>
{:else}
	<p>Session not found.</p>
{/if}
