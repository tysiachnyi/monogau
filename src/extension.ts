import * as vscode from 'vscode';


function createWebviewPanel(title: string, content: string) {
	const panel = vscode.window.createWebviewPanel(
			'extensionUI',
			title,
			vscode.ViewColumn.One,
			{}
	);

	panel.webview.html = content;
}

export function activate(context: vscode.ExtensionContext) {
	let openCommandsDisposable = vscode.commands.registerCommand('monogau.openCommands', () => {
		createWebviewPanel('Commands', getWebviewContentCommands());
});

let openDocumentationDisposable = vscode.commands.registerCommand('monogau.openDocumentation', () => {
		createWebviewPanel('Documentation', getWebviewContentDocumentation());
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

function getWebviewContentCommands() {
    return `
        <html>
        <body>
            <h1>Hello, World! Commands </h1>
        </body>
        </html>`;
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