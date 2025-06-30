# Blueprint 04: CLI Mode

This blueprint outlines the development of a "CLI Mode" within the Gemini GUI. This feature will provide a secure and user-friendly interface for executing `gemini` commands directly from the application.

## Core Functionality

- **Tauri Command for `gemini`:** A dedicated Tauri command in the Rust backend will handle the execution of all `gemini` commands. This approach ensures that the frontend does not have direct access to the shell, enhancing the application's security.
- **`gemini` Installation Check:** Upon loading the CLI Mode page, the application will check if the `gemini-cli` is installed and available in the system's PATH.
- **Command Input:** A user-friendly input field will be provided for users to enter their `gemini` commands.
- **Output Display:** The output of the executed command (both `stdout` and `stderr`) will be displayed in a clear and readable format.
- **Error Handling:** The application will gracefully handle cases where the `gemini-cli` is not installed or when a command fails to execute.

## Implementation Details

- **Frontend (SvelteKit):**
    - A new route and page will be created for the CLI Mode (`/cli`).
    - The page will use the `invoke` function from `@tauri-apps/api/core` to call the `execute_gemini` and `check_gemini` Tauri commands.
    - The UI will be built using `shadcn-svelte` components for a consistent look and feel.
- **Backend (Rust/Tauri):**
    - A new `execute_gemini` command will be added to `src-tauri/src/lib.rs`. This command will use `tauri::Shell` to execute the `gemini` command with the provided arguments.
    - A `check_gemini` command will be added to verify the existence of the `gemini` executable.
    - The `tauri.conf.json` file will be updated to allow the `shell` feature and scope the `execute` command to only `gemini`.
