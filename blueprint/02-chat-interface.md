
# Blueprint: Chat Interface

This blueprint details the creation of the main chat interface.

## 1. Layout

- [ ] Create a main layout in `src/routes/+layout.svelte`.
- [ ] Implement a sidebar for sessions and navigation.
- [ ] Implement a main content area for the chat.
- [ ] Use `bits-ui`'s `SplitPane` to create a resizable layout.

## 2. Message Display

- [ ] Create a `Message` component to display individual chat messages.
- [ ] Differentiate between user messages and model messages (e.g., different background colors).
- [ ] Implement a `MessageList` component to display a list of messages.
- [ ] Use a `ScrollArea` from `bits-ui` to make the message list scrollable.

## 3. Chat Input

- [ ] Create a `ChatInput` component.
- [ ] Use a `textarea` for multi-line input.
- [ ] Add a "Send" button.
- [ ] Handle form submission to send the user's message.

## 4. Markdown & Syntax Highlighting

- [ ] Use a library like `marked` to render Markdown in the model's responses.
- [ ] Use a library like `highlight.js` or `prism.js` to add syntax highlighting to code blocks within the rendered Markdown.
- [ ] Ensure proper styling for rendered Markdown elements.
