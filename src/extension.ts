import * as vscode from 'vscode';

import { MonogauDataProvider, MonogauViewPanelCreator, commandList } from './view';

export function activate(context: vscode.ExtensionContext) {
    const monogauViewPanelCreator = new MonogauViewPanelCreator(context, commandList);

    let openCommandsDisposable = vscode.commands.registerCommand('monogau.openCommands', () => {
        monogauViewPanelCreator.createWebviewPanel('Commands', monogauViewPanelCreator.getWebviewContentCommands());
    });

    let openDocumentationDisposable = vscode.commands.registerCommand('monogau.openDocumentation', () => {
        monogauViewPanelCreator.createWebviewPanel('Documentation', getWebviewContentDocumentation());
    });

    context.subscriptions.push(openCommandsDisposable, openDocumentationDisposable);

    const treeDataProvider = new MonogauDataProvider();
    vscode.window.createTreeView('myView', { treeDataProvider });
}



function getWebviewContentDocumentation() {
    return `
        <html>
        <body>
            <h1>Hello, World Documentation!</h1>
        </body>
        </html>`;
}