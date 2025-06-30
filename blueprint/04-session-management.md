
# Blueprint: Session Management

This blueprint outlines the features for managing chat sessions.

## 1. Data Structure

- [ ] Define a TypeScript interface for a `ChatMessage` (role, content).
- [ ] Define a TypeScript interface for a `ChatSession` (id, title, messages, timestamp).

## 2. Storage

- [ ] **Backend (Tauri):**
    - [ ] Create Rust commands for session CRUD (Create, Read, Update, Delete).
    - [ ] Use a simple solution like `tauri-plugin-store` or a local JSON file to persist the session data. For a more robust solution, consider using a lightweight database like SQLite via a Tauri plugin.
- [ ] **Frontend (SvelteKit):**
    - [ ] Create a Svelte store to manage the current session state.
    - [ ] Call the Tauri commands to interact with the stored sessions.

## 3. UI

- [ ] **Session List:**
    - [ ] In the sidebar, display a list of all saved chat sessions.
    - [ ] Allow the user to click on a session to load it into the main chat view.
    - [ ] Add a button to create a new chat session.
    - [ ] Add a button to delete a chat session (with a confirmation dialog).
- [ ] **Session Renaming:**
    - [ ] Allow the user to rename a chat session.
