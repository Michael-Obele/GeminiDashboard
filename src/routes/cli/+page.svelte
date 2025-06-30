<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "$lib/components/ui/card/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { invoke } from "@tauri-apps/api/core";
  import { goto } from "$app/navigation";
  import MarkdownRenderer from "$lib/components/MarkdownRenderer.svelte";
  import { preventDefault } from "svelte/legacy";

  let commandInput = $state("");
  let output = $state("");
  let error = $state("");
  let loading = $state(false);

  async function executeCommand() {
    error = "";
    output = "";
    loading = true;
    console.log("Executing command with input:", commandInput);

    try {
      const args = commandInput.split(" ");
      console.log("Invoking backend with args:", args);
      const result: string = await invoke("execute_gemini", { args });
      console.log("Received result from backend:", result);
      output = result;
    } catch (e) {
      console.error("Error received from backend:", e);
      if (typeof e === "string" && e.includes("No such file or directory")) {
        error =
          "Gemini CLI not found. Please specify the full path to the executable in the settings.";
      } else {
        error = e as string;
      }
    } finally {
      loading = false;
      console.log("Execution finished.");
    }
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>CLI Mode</CardTitle>
    <CardDescription>Execute Gemini CLI commands directly</CardDescription>
  </CardHeader>
  <CardContent class="space-y-4">
    <form class="space-y-2" onsubmit={executeCommand}>
      <Label for="command">Gemini command</Label>
      <div class="flex gap-2">
        <Input
          id="command"
          bind:value={commandInput}
          placeholder="e.g. chat 'hello'"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {#if loading}
            <svg
              class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Executing...
          {:else}
            Execute
          {/if}
        </Button>
      </div>
    </form>
    {#if output}
      <div class="bg-muted rounded-md p-4">
        <MarkdownRenderer content={output} />
      </div>
    {/if}
    {#if error}
      <div
        class="border-destructive bg-destructive/10 text-destructive rounded-md border p-4 text-sm"
      >
        <p>{error}</p>
        {#if error.includes("not found")}
          <Button variant="link" class="p-0" onclick={() => goto("/settings")}
            >Go to Settings</Button
          >
        {/if}
      </div>
    {/if}
  </CardContent>
</Card>
