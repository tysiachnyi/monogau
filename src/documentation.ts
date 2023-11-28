export function getWebviewContentDocumentation() {
  return `
      <html>
      <body>
          <h1>Documentation</h1>
          <button onclick="runCommand()">Run Command</button>
          <script>
              function runCommand() {
                  vscode.postMessage({
                      command: 'runCommand'
                  });
              }
          </script>
      </body>
      </html>`;
}