# n8n-nodes-icloud-drive-tools
Unofficial n8n nodes to manage files directly in iCloud Drive.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the TypeScript sources before packaging or testing:
   ```bash
   npm run build
   ```
3. Link or copy the compiled package into your n8n instance's custom nodes directory as you normally would.

## VS Code Debugging

The repository ships with `.vscode/launch.json`, and `.vscode/tasks.json` so you can launch or attach a Node.js debugger quickly.

1. Add `.vscode/settings.json` to point to your local n8n installation: 
   ```json
   {
     "n8n.launchRoot": "/path/to/your/n8n"
   }
   ```
2. Open the Run and Debug panel and pick **Launch n8n (inspect)**. This configuration:
   - runs `npm run build` before launch,
   - starts n8n with `node --inspect=9229` and `N8N_LOG_LEVEL=debug`,
   - opens the service in the integrated terminal so it stays running.
3. Set breakpoints in `nodes/ImapMove/ImapMove.node.ts` (source maps are emitted by the build), then run your workflow. The debugger pauses when the IMAP Move node executes.

If you already have n8n running separately with the inspector enabled, use the **Attach to n8n** profile instead.
