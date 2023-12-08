export type CommandList = {
  name: string;
  description: string;
  command: string;
}[];

export const commandList: CommandList = [
  {
      name: 'ls',
      description: 'List directory contents',
      command: 'ls'
  },
  {
      name: 'pwd',
      description: 'Print working directory',
      command: 'pwd'
  },
  {
      name: 'cd ..',
      description: 'Go up one directory',
      command: 'cd ..'
  },
  {
    name: 'monogau',
    description: 'Monogau',
    command: 'monogau'
  }
];


export function getWebviewContentCommands(commandList: CommandList) {
  const rows = commandList.map(command =>
      `<tr>
          <td>${command.name}</td>
          <td>${command.description}</td>
          <td><button onclick="runCommand('${command.name}')">▶️</button></td>
      </tr>`
  ).join('');
  return `
  <html>
  <head>
      <style>
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              border: 1px solid #ddd;
              padding: 8px;
              font-family: 'Courier New', Courier, monospace;
              font-size: 20px;
          }
          button {
              height: 24px;
              underline: none;
              background: none;
              border: none;
              cursor: pointer;
          }
          #mainImage {
              height: auto;
              center: 0;
              margin: auto;
              display: block;

          }
          #mainTitle {
              text-align: center;
              font-family: 'Courier New', Courier, monospace;
              font-size: 50px;
              color: #ffffff;
          }
      </style>
  </head>
  <body>
      <h1 id="mainTitle">Commands</h1>
      <image id="mainImage" src="https://media.giphy.com/media/l2YWs1NexTst9YmFG/giphy.gif" />
      <br />
      <br />
      <br />
      <table>
          <tr>
              <th>Command Name</th>
              <th>Description</th>
              <th>Run</th>
          </tr>
          ${rows}
      </table>
      <script>
          const vscode = acquireVsCodeApi();

          function runCommand(command) {
              vscode.postMessage({
                  command: 'runCommand',
                  text: command
              });
          }
      </script>
  </body>
  </html>`;
}
