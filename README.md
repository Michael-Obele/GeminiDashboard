# Gemini GUI Dashboard

A sleek, cross-platform desktop application for interacting with Google's Gemini models. This application provides a user-friendly interface for both the Gemini API and the `gemini-cli`, combining the best of both worlds for a powerful and intuitive user experience.

![Screenshot of Gemini GUI Dashboard](placeholder.png)

## ✨ Features

*   **Dual Mode Operation:**
    *   **API Mode:** A beautiful and intuitive chat interface for direct interaction with the Gemini API.
    *   **CLI Mode:** A powerful, integrated terminal for advanced users who want to leverage the full capabilities of the `gemini-cli`.
*   **Session Management:** Create, save, and switch between multiple chat sessions. Your conversations are persisted locally and never lost.
*   **Markdown Rendering:** Chat and CLI responses are beautifully rendered with full Markdown support, including code blocks, tables, and more.
*   **Cross-Platform:** Built with SvelteKit and Tauri, the Gemini GUI Dashboard runs natively on Windows, macOS, and Linux.
*   **Customizable:** Configure your API keys and CLI paths through a simple settings interface.
*   **Open Source:** Licensed under the MIT license, we welcome contributions from the community!

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Rust](https://www.rust-lang.org/)
*   [Bun](https://bun.sh/) (or `npm`/`yarn`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/gemini-dashboard.git
    cd gemini-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the application in development mode:**
    ```bash
    bun tauri dev
    ```

### Configuration

1.  **Set your Gemini API Key:**
    *   Navigate to the **Settings** page.
    *   Enter your Gemini API key. You can obtain one from [Google AI Studio](https://aistudio.google.com/apikey).
2.  **Configure the Gemini CLI Path (Optional):**
    *   If you want to use the CLI mode, you'll need to have the [`gemini-cli`](https://github.com/google-gemini/gemini-cli) installed.
    *   Find the path to your `gemini` executable by running `which gemini` in your terminal.
    *   Paste the full path into the "Gemini CLI Path" field on the **Settings** page.

## 🤝 Contributing

Contributions are welcome! Whether you're fixing a bug, adding a new feature, or improving the documentation, your help is appreciated. Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0. See the [LICENSE](LICENSE) file for details.


This template should help get you started developing with Tauri, SvelteKit and TypeScript in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).
