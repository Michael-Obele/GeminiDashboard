<script lang="ts">
	import { marked } from 'marked';

	export let content: string;

	$: formattedContent = marked(content);
</script>

<div class="prose dark:prose-invert max-w-none">
	{@html formattedContent}
</div>
