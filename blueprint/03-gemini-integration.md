
# Blueprint: Gemini Integration

This blueprint covers the integration with both the Gemini API and the Gemini CLI.

## 1. Gemini API (via SDK)

- [ ] **Backend (Tauri):**
    - [ ] Create a Rust command `invoke_gemini_api` that takes a prompt as an argument.
    - [ ] This command will use the `@google/genai` SDK (via a JavaScript file that is called from Rust) to send the request to the Gemini API.
    - [ ] Securely load the `GEMINI_API_KEY` from an environment variable or a configuration file on the backend. **Do not expose the key to the frontend.**
- [ ] **Frontend (SvelteKit):**
    - [ ] In the `ChatInput` component's submission handler, call the `invoke_gemini_api` Tauri command with the user's message.
    - [ ] Display the response from the command in the `MessageList`.
    - [ ] Implement loading indicators while waiting for the API response.
    - [ ] Implement comprehensive error handling and display user-friendly error messages.

## 2. Gemini CLI (via Shell Command)

- [ ] **Backend (Tauri):**
    - [ ] Create a Rust command `invoke_gemini_cli` that takes a string of arguments.
    - [ ] This command will use Tauri's `Command` API to execute the `gemini` CLI tool as a child process.
    - [ ] It will capture the `stdout`, `stderr`, and exit code of the process.
    - [ ] The command will stream the output back to the frontend in real-time if possible.
- [ ] **Frontend (SvelteKit):**
    - [ ] Create a separate UI view or a toggle within the chat interface to switch to "CLI Mode".
    - [ ] In CLI Mode, the input will be a text field for arguments to the `gemini` command.
    - [ ] The output will be displayed in a terminal-like view, preserving formatting and showing both stdout and stderr.
    - [ ] Provide controls to stop the running CLI command.
