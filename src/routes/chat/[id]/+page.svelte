<script lang="ts">
	import { page } from '$app/stores';
	import { sessions, activeSessionId, activeSession } from '$lib/stores/sessions';
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
	import { geminiService } from '$lib/services/gemini';
	import { toast } from 'svelte-sonner';
	import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

	let message = $state('');
	let loading = $state(false);
	let messagesContainer: HTMLElement;

	$effect(() => {
		activeSessionId.set($page.params.id);
	});

	$effect(() => {
		// Auto-scroll to bottom when new messages are added
		if (messagesContainer && $activeSession?.messages) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100);
		}
	});

	async function sendMessage() {
		if (!$activeSession || !message.trim() || loading) return;

		const userMessageContent = message.trim();
		message = '';
		loading = true;

		try {
			// Add user message
			await sessions.addMessage($activeSession.id, {
				role: 'user',
				content: userMessageContent
			});

			// Get AI response
			const response = await geminiService.sendMessage(
				userMessageContent, 
				$activeSession.messages
			);

			// Add AI response
			await sessions.addMessage($activeSession.id, {
				role: 'assistant',
				content: response
			});

			// Update session name if it's the first message
			if ($activeSession.messages.length === 2 && $activeSession.name === 'New Chat') {
				const sessionName = userMessageContent.slice(0, 50) + (userMessageContent.length > 50 ? '...' : '');
				await sessions.update($activeSession.id, { name: sessionName });
			}
		} catch (error: any) {
			console.error('Failed to send message:', error);
			toast.error(error.message || 'Failed to send message');
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}
</script>

{#if $activeSession}
	<div class="flex h-full flex-col">
		<Card class="flex flex-1 flex-col">
			<CardHeader>
				<CardTitle>{$activeSession.name}</CardTitle>
			</CardHeader>
			<CardContent class="flex-1 overflow-hidden">
				<div 
					bind:this={messagesContainer}
					class="h-full space-y-4 overflow-y-auto pr-4"
				>
					{#each $activeSession.messages as msg (msg.id)}
						<div class="flex items-start gap-4">
							<div
								class={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
									msg.role === 'user' 
										? 'bg-primary text-primary-foreground' 
										: 'bg-secondary text-secondary-foreground'
								}`}
							>
								{msg.role === 'user' ? 'You' : 'AI'}
							</div>
							<div class="flex-1 min-w-0">
								{#if msg.role === 'assistant'}
									<MarkdownRenderer content={msg.content} />
								{:else}
									<div class="prose dark:prose-invert max-w-none">
										<p class="whitespace-pre-wrap">{msg.content}</p>
									</div>
								{/if}
								<div class="mt-1 text-xs text-muted-foreground">
									{msg.timestamp.toLocaleTimeString()}
								</div>
							</div>
						</div>
					{/each}
					{#if loading}
						<div class="flex items-start gap-4">
							<div class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
								AI
							</div>
							<div class="flex-1">
								<div class="flex items-center gap-2">
									<div class="animate-pulse">Thinking...</div>
									<div class="flex gap-1">
										<div class="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
										<div class="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
										<div class="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</CardContent>
			<CardFooter class="border-t p-4">
				<form class="relative w-full" onsubmit={sendMessage}>
					<Textarea
						bind:value={message}
						placeholder="Type your message here... (Enter to send, Shift+Enter for new line)"
						class="min-h-[48px] w-full resize-none rounded-2xl border border-neutral-400 bg-background p-4 pr-16 text-sm shadow-sm"
						disabled={loading}
						onkeydown={handleKeydown}
					/>
					<div class="absolute bottom-3 right-3 flex gap-2">
						<Button type="submit" size="icon" disabled={!message.trim() || loading}>
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
	<div class="flex h-full items-center justify-center">
		<div class="text-center">
			<h2 class="text-2xl font-bold mb-2">Session not found</h2>
			<p class="text-muted-foreground">The requested chat session could not be found.</p>
		</div>
	</div>
{/if}