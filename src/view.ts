import * as vscode from 'vscode';
import { exec } from 'child_process';

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

const monogauViewPanelNames = {
  commands: 'Commands',
  documentation: 'Documentation'
};


export class MonogauDataProvider implements vscode.TreeDataProvider<string> {
  getTreeItem(element: string): vscode.TreeItem {
      const treeItem = new vscode.TreeItem(element);
      if (element === 'Commands') {
          treeItem.command = {
              command: 'monogau.openCommands',
              title: 'Open Commands'
          };
      }
      if (element === 'Documentation') {
          treeItem.command = {
              command: 'monogau.openDocumentation',
              title: 'Open Documentation'
          };
      }
      return treeItem;
  }

  getChildren(element?: string): Thenable<string[]> {
      if (element) {
          return Promise.resolve([]);
      } else {
          return Promise.resolve(['Commands', 'Documentation']);
      }
  }
}


export class MonogauViewPanelCreator {
  private context: vscode.ExtensionContext;
  private commandList: CommandList;

  constructor(context: vscode.ExtensionContext, commandList: CommandList) {
      this.context = context;
      this.commandList = commandList;
      this.createWebviewPanel = this.createWebviewPanel.bind(this);
      this.getWebviewContentCommands = this.getWebviewContentCommands.bind(this);
      this.executeError = this.executeError.bind(this);
  }

  executeError(error: any) {
      vscode.window.showErrorMessage(`Monogau have next error: ${error}`);
  }


  createWebviewPanel(title: string, content: string) {
      const panel = vscode.window.createWebviewPanel(
          'extensionUI',
          title,
          vscode.ViewColumn.One,
          {
              enableScripts: true
          }
      );

      panel.webview.onDidReceiveMessage(
          message => {
              if (message.command === 'runCommand') {
                  exec(message.text, (error, stdout, stderr) => {
                      if (error) {
                          this.executeError(error);
                          return;
                      }
                      console.log(`stdout: ${stdout}`);
                      console.error(`stderr: ${stderr}`);
                  });

                  vscode.window.showInformationMessage(`Running command: ${message.text}`);
              }
          },
          undefined,
          this.context.subscriptions
      );

      panel.webview.html = content;
  }

  public getWebviewContentCommands() {
    const rows = this.commandList.map(command =>
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

  }
