
# Blueprint: Settings

This blueprint details the application settings.

## 1. Settings Page

- [ ] Create a new route `/settings`.
- [ ] Add a link to the settings page in the main layout (e.g., a gear icon in the sidebar).

## 2. API Key Configuration

- [ ] Create an input field for the user to enter their Gemini API key.
- [ ] **Backend (Tauri):**
    - [ ] Create a Rust command `save_api_key` that securely stores the key (e.g., using `tauri-plugin-store` or the OS keychain).
    - [ ] Create a Rust command `load_api_key` that retrieves the key.
- [ ] **Frontend (SvelteKit):**
    - [ ] On the settings page, provide a button to save the API key, which calls the `save_api_key` command.
    - [ ] When the application loads, call the `load_api_key` command to check if a key is already configured.

## 3. Model Selection

- [ ] Add a dropdown menu to select the Gemini model to use (e.g., `gemini-pro`, `gemini-1.5-flash`).
- [ ] Store the selected model in the application's settings.
- [ ] The `invoke_gemini_api` command should use the selected model when making requests.

## 4. Theme Selection

- [ ] (Future) Add options to switch between light, dark, and system themes.
