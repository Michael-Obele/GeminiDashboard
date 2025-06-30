# Gemini CLI GUI - Development Plan

This document outlines the plan for building a Graphical User Interface (GUI) for the Gemini CLI. The application will be built using SvelteKit for the frontend and Tauri for the backend, providing a cross-platform desktop experience that leverages both the Gemini API and the local Gemini CLI tool.

## Guiding Principles & MCP Usage

To ensure efficient and high-quality development, we will adhere to the following rules for using Meta-Contextual Prompts (MCPs):

- **`exa` for Broad Research:** When we need to understand new concepts, explore libraries, or find best practices, we will start with `exa`. For example, "`exa` sveltekit tauri authentication" or "`exa` rust sqlite library".
- **`svelte-llm` for Svelte/SvelteKit:** For specific questions about Svelte or SvelteKit, we will use the `svelte-llm` MCP. This will provide us with targeted and accurate information from the official documentation.
- **`context7` for Other Libraries:** When we need documentation for other libraries, such as `@google/genai` or a Tauri plugin, we will use `context7`.
- **`claudia.md` as a Reference:** We will continue to use the `claudia.md` file as a high-level architectural reference, adapting its React-based patterns to our SvelteKit implementation.

## Core Architecture

The application will be a hybrid, providing two main modes of operation:

1.  **API Mode:** A user-friendly chat interface that interacts directly with the Gemini API via the `@google/genai` SDK. This mode is for conversational queries and content generation.
2.  **CLI Mode:** A terminal-like interface that acts as a frontend for the `gemini-cli` executable installed on the user's machine. This mode is for advanced users who want to leverage the full power of the CLI's features, such as local file system access and tool integration.

## Development Workflow & Memory

- **Package Manager:** We will use `bun` for all package management.
- **UI Components:** We will use `shadcn-svelte` for accessible and customizable UI components. Documentation can be found at [https://shadcn-svelte.com/](https://shadcn-svelte.com/) and component-specific docs at [https://shadcn-svelte.com/docs/components](https://shadcn-svelte.com/docs/components).
- **Memory Updates:** After each successful interaction, I will update my memory with a summary of what was done and what I learned. This will ensure I have the proper context for future interactions.

## Development Blueprint

The development process is broken down into modular blueprints, located in the `/blueprint` directory. This approach allows us to focus on one feature at a time.

- **[Blueprint 01: Core Setup](./blueprint/01-core-setup.md)**: Project initialization, Tauri integration, and dependency setup.
- **[Blueprint 02: Chat Interface](./blueprint/02-chat-interface.md)**: Building the main UI for the chat.
- **[Blueprint 03: Gemini Integration](./blueprint/03-gemini-integration.md)**: Connecting to both the Gemini API and the Gemini CLI.
- **[Blueprint 04: CLI Mode](./blueprint/04-cli-mode.md)**: A terminal-like interface for the `gemini-cli` executable.
- **[Blueprint 05: Session Management](./blueprint/05-session-management.md)**: Saving, loading, and managing chat sessions.
- **[Blueprint 06: Settings](./blueprint/06-settings.md)**: Application configuration, including API keys and model selection.

## Future Development

Once the core features are implemented, we can explore the following enhancements:

- [ ] **Advanced CLI Mode:**
    - [ ] Tab completion for CLI commands and arguments.
    - [ ] History of executed CLI commands.
- [ ] **Tool & MCP Integration:**
    - [ ] A UI for managing and using custom tools with the Gemini CLI.
    - [ ] A UI for managing and using MCP servers.
- [ ] **Multimodality:**
    - [ ] Support for image and PDF inputs in API mode.
- [ ] **Plugin System:**
    - [ ] Allow users to extend the application with their own plugins.
- [ ] **Theme Customization:**
    - [ ] More advanced theme options.
