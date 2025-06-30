
# Blueprint: Core Setup

This blueprint outlines the initial project setup and configuration.

## 1. SvelteKit Project Initialization

- [ ] Initialize a new SvelteKit project using `npm create svelte@latest my-app`.
- [ ] Select the "Skeleton project" option.
- [ ] Choose "TypeScript" for the language.
- [ ] Add Prettier for code formatting.

## 2. Tauri Integration

- [ ] Add Tauri to the SvelteKit project using `npm install -D @tauri-apps/cli`.
- [ ] Initialize Tauri with `npm run tauri init`.
- [ ] Follow the prompts to configure the Tauri application.

## 3. SvelteKit Configuration for Tauri

- [ ] Install `@sveltejs/adapter-static`: `npm i -D @sveltejs/adapter-static@next`.
- [ ] In `svelte.config.js`, import the adapter and update the `kit.adapter` to use it.
- [ ] Create `src/routes/+layout.ts` and add `export const ssr = false;` to disable SSR.
- [ ] In `tauri.conf.json`, set `build.distDir` to `../build` and `build.devPath` to `http://localhost:5173`.

## 4. Dependencies

- [ ] Install core dependencies:
    - `@google/genai`
    - `lucide-svelte`
    - `bits-ui`
    - `clsx`
    - `tailwind-merge`
    - `tailwindcss`
- [ ] Initialize Tailwind CSS: `npx tailwindcss init -p`.
- [ ] Configure `tailwind.config.js` and `app.css`.
