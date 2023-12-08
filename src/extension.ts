
import * as vscode from 'vscode';
import { exec } from 'child_process';
import {  commandList, getWebviewContentCommands } from './commands';



function createWebviewPanel(context: vscode.ExtensionContext, title: string, content: string) {
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
                        console.error(`exec error: ${error}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                });

                vscode.window.showInformationMessage(`Running command: ${message.text}`);
            }
        },
        undefined,
        context.subscriptions
    );

    panel.webview.html = content;
}

export function activate(context: vscode.ExtensionContext) {
    let openCommandsDisposable = vscode.commands.registerCommand('monogau.openCommands', () => {
        createWebviewPanel(context, 'Commands', getWebviewContentCommands(commandList));
    });

    let openDocumentationDisposable = vscode.commands.registerCommand('monogau.openDocumentation', () => {
        createWebviewPanel(context, 'Documentation', getWebviewContentDocumentation());
    });

    context.subscriptions.push(openCommandsDisposable, openDocumentationDisposable);

    const treeDataProvider = new MyTreeDataProvider();
    vscode.window.createTreeView('myView', { treeDataProvider });
}

class MyTreeDataProvider implements vscode.TreeDataProvider<string> {
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





function getWebviewContentDocumentation() {
	return `
			<html>
			<body>
					<h1>Hello, World Documentation!</h1>
			</body>
			</html>`;
}

export function deactivate() {}